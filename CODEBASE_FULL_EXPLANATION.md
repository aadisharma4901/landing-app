# 📚 FULL CODEBASE EXPLANATION

## Complete Line-by-Line Breakdown

---

## 🔌 DATABASE CONNECTION FILES

### 1. `src/lib/supabase.ts` (CLIENT)

**Purpose: Frontend browser connection to Supabase**

```ts
import { createClient } from "@supabase/supabase-js";

// ✅ Load environment variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ✅ Create client that runs in user's browser
// Uses ANON KEY which has LIMITED permissions (RLS protected)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

✅ **Why we add this:**

- For client side components (cart page, orders page)
- Respects Row Level Security (RLS) policies
- User can only see THEIR OWN data
- No admin permissions ever exposed to browser

---

### 2. `src/lib/supabase-server.ts` (SERVER)

**Purpose: Backend API Route connection with FULL ADMIN RIGHTS**

```ts
import { createClient } from "@supabase/supabase-js";

// ✅ Uses SERVICE ROLE KEY which BYPASSES ALL RLS
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ✅ This client can READ/WRITE EVERYTHING in database
// NEVER USE THIS IN FRONTEND CODE - ONLY IN SERVER API ROUTES
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
```

✅ **Why we add this:**

- For backend processing only
- Can create orders, clear carts, modify data
- Bypasses RLS for automated operations
- Is secure because it never leaves your server

---

## 🛒 CART API ROUTE `src/app/api/cart/route.ts`

**Purpose: All cart operations (add/remove/update/clear)**

### GET - Fetch User Cart

```ts
export async function GET() {
  // ✅ Get currently logged in Clerk user ID
  const { userId } = await auth();

  // ✅ Fetch cart items + JOIN WITH PRODUCTS TABLE
  const { data } = await supabaseServer
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      product:products (*)
    `,
    )
    .eq("user_id", userId); // 🔒 ONLY GET THIS USER'S CART
}
```

✅ **What this does:** Automatically joins product data so you don't have to fetch products separately.

### POST - Add Item To Cart

```ts
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const body = await request.json();
  const productId = Number(body.productId);
  const quantityToAdd = Number(body.quantity);

  // ✅ Check if item already exists in cart
  const { data: existing } = await supabaseServer
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // ✅ INCREASE QUANTITY instead of duplicate item
    return supabaseServer
      .from("cart_items")
      .update({ quantity: existing.quantity + quantityToAdd });
  } else {
    // ✅ ADD NEW ITEM
    return supabaseServer
      .from("cart_items")
      .insert({
        user_id: userId,
        product_id: productId,
        quantity: quantityToAdd,
      });
  }
}
```

✅ **Why this is important:** Prevents duplicate products in cart, just increases quantity.

### DELETE - Clear / Remove Item

```ts
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const cartItemId = body.cartItemId;

  if (cartItemId) {
    // ✅ DELETE SINGLE ITEM
    return supabaseServer.from("cart_items").delete().eq("id", cartItemId);
  } else {
    // ✅ DELETE ALL ITEMS FOR THIS USER (CLEAR CART)
    return supabaseServer.from("cart_items").delete().eq("user_id", userId);
  }
}
```

---

## 💳 CHECKOUT API `src/app/api/checkout/route.ts`

**Purpose: Create Stripe payment session**

```ts
export async function POST(req: NextRequest) {
  const { userId } = await auth();

  // ✅ Get all items from user cart with product prices
  const { data: cartItems } = await supabaseServer
    .from("cart_items")
    .select(`quantity, product:products (name, price)`)
    .eq("user_id", userId);

  // ✅ Convert cart items to Stripe format
  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.product.name },
      unit_amount: Math.round(item.product.price * 100), // 💡 Stripe uses CENTS
    },
    quantity: item.quantity,
  }));

  // ✅ CREATE STRIPE CHECKOUT SESSION
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.nextUrl.origin}/cancel`,
    metadata: { userId }, // 💡 Save user id inside Stripe session
  });

  // ✅ Return Stripe checkout URL to frontend
  return NextResponse.json({ url: session.url });
}
```

---

## ✅ CHECKOUT SUCCESS API `src/app/api/checkout/success/route.ts`

**THIS IS THE MOST IMPORTANT FILE**
**Purpose: Runs AFTER PAYMENT IS SUCCESSFUL**

### ✅ CORRECT EXECUTION ORDER:

```
1. User pays with Stripe ✔️
2. User is redirected to /success page ✔️
3. Success page calls this API ✔️
4. 🔴 WE FETCH CART FIRST BEFORE DOING ANYTHING
5. ✅ Save order to database
6. ✅ ONLY THEN clear cart
```

```ts
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const sessionId = searchParams.get("session_id");

  // 1️⃣ VERIFY STRIPE PAYMENT
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // ❌ STOP EVERYTHING IF PAYMENT NOT PAID
  if (session.payment_status !== "paid") return error;

  // 2️⃣ FETCH FULL CART FROM DATABASE
  const { data: cartItems } = await supabaseServer
    .from("cart_items")
    .select(`id, quantity, product:products (*)`)
    .eq("user_id", userId);

  // 3️⃣ CALCULATE TOTAL PRICE
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // 4️⃣ SAVE ORDER PERMANENTLY
  const { data: order } = await supabaseServer
    .from("orders")
    .insert({
      user_id: userId,
      stripe_session_id: session.id,
      total_price: totalPrice,
      status: "paid",
      products: cartItems, // ✅ SAVE FULL PRODUCT DATA AS JSON
    })
    .select()
    .single();

  // 5️⃣ ✅ ONLY NOW CLEAR CART - AFTER ORDER IS SAVED!
  await supabaseServer.from("cart_items").delete().eq("user_id", userId);

  return NextResponse.json({ success: true, orderId: order.id });
}
```

✅ **Critical Fix Explained:**

> ❌ OLD BAD CODE: Cleared cart on frontend first → backend got empty cart
> ✅ NEW GOOD CODE: Fetch cart first → save order → clear cart last

---

## 🏠 SUCCESS PAGE `src/app/success/page.tsx`

**Purpose: Show after payment, call order processing API**

```ts
function SuccessContent() {
  const sessionId = useSearchParams().get("session_id");
  const hasClearedCart = useRef(false);

  // ✅ RUNS ONLY ONCE WHEN PAGE LOADS
  useEffect(() => {
    if (sessionId && !hasClearedCart.current) {
      hasClearedCart.current = true;

      // ✅ CALL BACKEND TO PROCESS ORDER
      fetch(`/api/checkout/success?session_id=${sessionId}`);
    }
  }, [sessionId]);

  // ✅ INVOICE DOWNLOAD FUNCTION
  const downloadInvoice = () => {
    const invoiceContent = `Order ID: ${sessionId}\nDate: ${new Date()}`;

    // ✅ Create file in browser and trigger download
    const blob = new Blob([invoiceContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${sessionId.slice(0, 12)}.txt`;
    a.click();
  };
}
```

---

## 📦 ORDERS PAGE `src/app/orders/page.tsx`

**Purpose: Show user's past orders**

```ts
const fetchOrders = async () => {
  // ✅ Fetch orders with nested products
  const { data } = await supabase
    .from("orders")
    .select(
      `
      id,
      created_at,
      total_price,
      status,
      products
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
};
```

---

## 🔐 ROW LEVEL SECURITY (RLS)

**Found in `supabase-dev.sql`**

```sql
-- ✅ USER CAN ONLY SEE THEIR OWN ORDERS
create policy "Users can view own orders"
on orders
for select
using (auth.uid() = user_id);

-- ✅ USER CAN ONLY MODIFY THEIR OWN CART
create policy "Allow delete own cart items"
on cart_items
for delete
using (auth.uid() = user_id);
```

✅ **Why we add this:**

- Even if someone hacks frontend, they cannot see other user's orders
- Database itself enforces security
- Works even if API has bugs

---

## 📊 DATABASE TABLES STRUCTURE

| Table        | Columns                                                                 | Purpose                 |
| ------------ | ----------------------------------------------------------------------- | ----------------------- |
| `cart_items` | id, user_id, product_id, quantity                                       | Temporary shopping cart |
| `orders`     | id, user_id, stripe_session_id, total_price, status, **products JSONB** | Permanent order history |
| `products`   | id, name, price, description, image_url                                 | Store products catalog  |
| `users`      | id, email, first_name, last_name                                        | Clerk synced users      |

---

## ✨ KEY FIXES WE MADE

1. ✅ **Removed frontend cart clearing** → never clear cart before order is saved
2. ✅ **Store products as JSON in orders** → no more foreign key issues
3. ✅ **Correct execution order** → fetch → save → clear
4. ✅ **Full error logging** → every step is logged for debugging
5. ✅ **No more empty cart issues** → cart is always fetched fresh from database

---

## 🔄 COMPLETE FULL FLOW

```
1. User adds product to cart → saved to cart_items
2. User clicks Checkout → goes to Stripe
3. User pays → Stripe confirms payment
4. User lands on /success page
5. Success page calls /api/checkout/success
6. Backend: ✅ fetch cart ✅ save order ✅ clear cart
7. Order saved permanently
8. Cart is now empty
9. Invoice download available
```
