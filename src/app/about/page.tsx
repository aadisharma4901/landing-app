import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <ScrollReveal className="text-center mb-20">
          <h1 className="text-4xl sm:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
            About <span className="text-zinc-600">Banazon</span>
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
             Your trusted destination for premium electronics since 2020. We bring you the best technology products at unbeatable prices — with a shopping experience that&apos;s actually enjoyable.
          </p>
        </ScrollReveal>

        {/* Mission Section */}
        <ScrollReveal className="bg-gradient-to-br from-zinc-50 to-white rounded-3xl p-10 md:p-16 mb-20 border border-zinc-100">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-zinc-900 mb-6">Our Mission</h2>
            <p className="text-lg text-zinc-700 leading-relaxed mb-8">
              At Banazon, we believe everyone deserves access to premium technology. We curate only the highest quality electronics from trusted manufacturers and bring them directly to you with competitive pricing, fast shipping, and exceptional customer support.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-600">
              <span className="px-4 py-2 bg-white rounded-full border border-zinc-200">✓ Authentic Products</span>
              <span className="px-4 py-2 bg-white rounded-full border border-zinc-200">✓ Price Match Guarantee</span>
              <span className="px-4 py-2 bg-white rounded-full border border-zinc-200">✓ 30-Day Returns</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { num: '50K+', label: 'Happy Customers', icon: '👥' },
            { num: '10K+', label: 'Products Sold', icon: '📦' },
            { num: '4.9★', label: 'Average Rating', icon: '⭐' },
            { num: '99%', label: 'Satisfaction Rate', icon: '✅' }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl border border-zinc-100 p-8 text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-zinc-900 mb-1">{stat.num}</div>
              <div className="text-sm text-zinc-600">{stat.label}</div>
            </div>
          ))}
        </ScrollReveal>

        {/* Why Choose Us */}
        <ScrollReveal className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-zinc-900">Why Banazon?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-zinc-100 hover:border-zinc-200 transition-colors">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Curated Quality</h3>
              <p className="text-zinc-600 leading-relaxed">
                Every product is hand-picked. No junk, no knockoffs — just premium electronics from top brands like Apple, Samsung, Sony, and more.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-zinc-100 hover:border-zinc-200 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Lightning Fast</h3>
              <p className="text-zinc-600 leading-relaxed">
                Orders ship within 24 hours. Free delivery on all orders over $99. Track your package in real-time from warehouse to doorstep.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-zinc-100 hover:border-zinc-200 transition-colors">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Buyer Protection</h3>
              <p className="text-zinc-600 leading-relaxed">
                30-day hassle-free returns. 1-year warranty on all products. 24/7 customer support that actually responds.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-zinc-100 hover:border-zinc-200 transition-colors">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-zinc-900 mb-3">Better Than Amazon</h3>
               <p className="text-zinc-600 leading-relaxed">
                 No more sifting through thousands of fake reviews. We only list products we&apos;d buy ourselves — each one tested and verified by our team.
               </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Team Section */}
        <ScrollReveal className="bg-zinc-900 rounded-3xl p-10 md:p-16 mb-20 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-zinc-800 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-zinc-800 rounded-full blur-3xl opacity-50" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Built by Tech Lovers, for Tech Lovers</h2>
             <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto">
               Our team is made up of engineers, designers, and gadget enthusiasts who actually use the products we sell. We started Banazon because we were tired of poor online shopping experiences — and we&apos;re on a mission to fix it.
             </p>
            <Link 
              href="/products"
              className="inline-block px-10 py-4 bg-white text-zinc-900 rounded-xl font-bold text-lg hover:bg-zinc-100 transition-colors shadow-xl"
            >
              Explore Products
            </Link>
          </div>
        </ScrollReveal>

        {/* Tech Stack / Trust */}
        <ScrollReveal>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider mb-6">
              Trusted Brands We Work With
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Logitech'].map((brand) => (
                <div key={brand} className="text-2xl font-bold text-zinc-400">{brand}</div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
