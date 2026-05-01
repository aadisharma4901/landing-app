import ScrollReveal from './ScrollReveal';
import React from 'react';

export default function CTA(): React.JSX.Element {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Background decoration - pure CSS */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-float-slow" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl translate-x-1/2 translate-y-1/2 animate-float-slow" style={{ animationDelay: '9s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight text-balance">
            Ready to elevate your
            <br />
            <span className="text-zinc-300">productivity?</span>
          </h2>

          <p className="text-lg text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams already using Elevate. Start your free trial
            today — no credit card required.
          </p>

          <a
            href="#"
            className="btn-interactive inline-flex items-center justify-center px-10 py-5 bg-white text-zinc-900 rounded-full font-semibold text-lg hover:bg-zinc-100 shadow-2xl"
          >
            Get Started Free
            <svg
              className="ml-3 w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>

          <p className="mt-6 text-sm text-zinc-400">
            Free 14-day trial · No credit card required · Cancel anytime
          </p>

          {/* Trust badges */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-400 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>256-bit SSL encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>SOC 2 Type II compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>GDPR ready</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}