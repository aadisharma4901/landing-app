-- Cart items foreign key
alter table cart_items
add constraint cart_items_user_id_fkey
foreign key (user_id)
references users(id)
on delete cascade;

-- Public read policies
create policy "Allow public read users"
on users
for select
to public
using (true);

create policy "Allow public read products"
on products
for select
to public
using (true);

-- Cart items RLS per user
create policy "Allow select own cart items"
on cart_items
for select
to public
using (auth.uid() = user_id);

create policy "Allow insert own cart items"
on cart_items
for insert
to public
with check (auth.uid() = user_id);

create policy "Allow update own cart items"
on cart_items
for update
to public
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Allow delete own cart items"
on cart_items
for delete
to public
using (auth.uid() = user_id);

-- Orders table with JSONB products column
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) not null,
  stripe_session_id text unique not null,
  total_price numeric(10,2) not null,
  status text default 'paid' not null,
  products jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add products column if table already exists
alter table orders
add column if not exists products jsonb;

-- Orders RLS
alter table orders enable row level security;

create policy "Users can view own orders"
on orders
for select
using (auth.uid() = user_id);

create policy "Users can insert own orders"
on orders
for insert
to public
with check (auth.uid() = user_id);

-- Drop order_items table completely (not used)
drop table if exists order_items cascade;
