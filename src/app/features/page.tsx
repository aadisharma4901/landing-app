// import ScrollReveal from '@/components/ScrollReveal';

// const featureDetails = [
//   {
//     id: 1,
//     title: 'Lightning Fast Performance',
//     description: 'Experience blazing-fast load times and zero lag interactions. Our optimized infrastructure ensures your team stays productive without waiting.',
//     benefits: [
//       'Sub 100ms response times',
//       'Global CDN distribution',
//       'Zero downtime architecture',
//       'Optimized asset delivery'
//     ],
//     icon: '⚡'
//   },
//   {
//     id: 2,
//     title: 'Enterprise Grade Security',
//     description: 'Bank-grade encryption and compliance standards protect your data. Rest easy knowing your information is safe with advanced security measures.',
//     benefits: [
//       '256-bit AES encryption',
//       'SOC 2 Type II compliant',
//       'Regular security audits',
//       'GDPR & HIPAA ready'
//     ],
//     icon: '🔒'
//   },
//   {
//     id: 3,
//     title: 'Seamless Team Collaboration',
//     description: 'Work together in real-time with comments, shared workspaces, and live updates. Keep everyone aligned regardless of location.',
//     benefits: [
//       'Real-time collaborative editing',
//       'Threaded comments & mentions',
//       'Shared workspace permissions',
//       'Activity timeline & history'
//     ],
//     icon: '👥'
//   },
//   {
//     id: 4,
//     title: 'Powerful Analytics Dashboard',
//     description: 'Gain actionable insights with comprehensive analytics. Track progress, measure success, and make data-driven decisions.',
//     benefits: [
//       'Customizable dashboards',
//       'Real-time metrics tracking',
//       'Exportable reports',
//       'Predictive analytics'
//     ],
//     icon: '📊'
//   },
//   {
//     id: 5,
//     title: 'Intelligent Automation',
//     description: 'Automate repetitive tasks and workflows. Let the system handle routine work while your team focuses on what matters.',
//     benefits: [
//       'Workflow automation builder',
//       'Smart rule-based triggers',
//       'Integration with 100+ tools',
//       'Custom bot actions'
//     ],
//     icon: '🤖'
//   },
//   {
//     id: 6,
//     title: 'Unlimited Integrations',
//     description: 'Connect with all your favorite tools and services. Seamless integrations ensure your workflow remains uninterrupted.',
//     benefits: [
//       'Slack, Discord, Teams integration',
//       'GitHub, GitLab, Bitbucket',
//       'Jira, Asana, Trello',
//       'Custom API webhooks'
//     ],
//     icon: '🔗'
//   }
// ];

// export default function FeaturesPage() {
//   return (
//     <main className="pt-24 pb-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Page Header */}
//         <ScrollReveal className="text-center mb-20">
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
//             Powerful Features
//           </h1>
//           <p className="text-xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
//             Everything you need to take your team productivity to the next level.
//             Built for modern teams that demand excellence.
//           </p>
//         </ScrollReveal>

//         {/* Feature Grid */}
//         <div className="space-y-16">
//           {featureDetails.map((feature, index) => (
//             <ScrollReveal key={feature.id} delay={index * 100}>
//               <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
//                 <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
//                   <div className="text-5xl mb-4">{feature.icon}</div>
//                   <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
//                     {feature.title}
//                   </h2>
//                   <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
//                     {feature.description}
//                   </p>
//                   <ul className="space-y-3">
//                     {feature.benefits.map((benefit, i) => (
//                       <li key={i} className="flex items-center gap-3 text-zinc-700">
//                         <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                         </svg>
//                         {benefit}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-3xl transform rotate-3 opacity-50" />
//                     <div className="relative bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
//                       <div className="p-12 h-80 bg-gradient-to-br from-zinc-50 to-white flex items-center justify-center">
//                         <div className="text-8xl opacity-30">{feature.icon}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </ScrollReveal>
//           ))}
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="mt-24">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <ScrollReveal>
//             <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-12 text-white">
//               <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
//               <p className="text-zinc-300 mb-8 max-w-xl mx-auto">
//                 Start your free 14-day trial today and experience the difference.
//               </p>
//               <a
//                 href="#"
//                 className="btn-interactive inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-900 rounded-full font-semibold text-lg shadow-xl"
//               >
//                 Start Free Trial
//               </a>
//             </div>
//           </ScrollReveal>
//         </div>
//       </div>
//     </main>
//   );
// }