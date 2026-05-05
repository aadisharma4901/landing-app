import ScrollReveal from '@/components/ScrollReveal';
import React from 'react';

export default function ContactPage() {
  return (
    <main className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <ScrollReveal className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
            Get In Touch
          </h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <ScrollReveal>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-400 focus:outline-none transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-400 focus:outline-none transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-400 focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-400 focus:outline-none transition-colors"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-zinc-400 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-interactive w-full bg-zinc-900 text-white py-4 rounded-xl font-semibold text-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* Contact Information */}
          <ScrollReveal delay={100}>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">Email</h3>
                      <p className="text-zinc-600">hello@elevate.app</p>
                      <p className="text-zinc-600">support@elevate.app</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">Office</h3>
                      <p className="text-zinc-600">123 Innovation Drive</p>
                      <p className="text-zinc-600">San Francisco, CA 94107</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900">Business Hours</h3>
                      <p className="text-zinc-600">Monday - Friday: 9am - 6pm PST</p>
                      <p className="text-zinc-600">Weekend: Support only</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-zinc-100 to-zinc-50 rounded-3xl p-8">
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Need urgent help?</h3>
                <p className="text-zinc-600 mb-6">
                  Our support team is available 24/7 for critical issues.
                </p>
               <button
                 type="button"
                 className="btn-interactive inline-flex items-center px-6 py-3 bg-zinc-900 text-white rounded-full font-semibold"
               >
                 Start Live Chat
               </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}