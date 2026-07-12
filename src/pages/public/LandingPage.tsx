import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Sparkles, Award, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-24 lg:pb-32">
        {/* Dynamic blurred backdrop shapes */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/10 blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-teal-400/10 blur-[120px] animate-pulse-slow pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-800 mb-8 animate-fade-in-up tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
              Campus Event Hub
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.05] font-display animate-fade-in-up">
              Connect & Experience <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Every Campus Event
              </span>
            </h1>
            
            <p className="mt-8 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto animate-fade-in-up">
              Discover student gatherings, academic workshops, sports meets, and cultural festivals. One place to manage all your campus engagements.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
              {user ? (
                <Link
                  to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-2xl text-sm font-semibold hover:shadow-lg hover:shadow-emerald-600/25 active:scale-95 transition-all duration-200"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-2xl text-sm font-semibold hover:shadow-lg hover:shadow-emerald-600/25 active:scale-95 transition-all duration-200"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
                  >
                    Browse Events
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/60 p-8 shadow-sm">
            {[
              { number: "50+", label: "Active Organizers" },
              { number: "250+", label: "Successful Events" },
              { number: "5,000+", label: "Registered Users" },
              { number: "98%", label: "Satisfaction Rate" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-display">{stat.number}</p>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">Everything you need</h2>
            <p className="mt-4 text-slate-600 text-base max-w-xl mx-auto">Streamline campus event creation, discovery, and coordination from start to finish.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: 'Instant Discovery',
                description: 'Explore live event schedules, filter categories, and find gatherings that match your schedule and interests.',
                gradient: 'from-emerald-500/10 to-teal-500/10',
                iconColor: 'text-emerald-600',
                border: 'hover:border-emerald-500/30'
              },
              {
                icon: Award,
                title: 'Seamless Management',
                description: 'Organizers can host events, set seating limits, track attendance growth, and download records easily.',
                gradient: 'from-blue-500/10 to-indigo-500/10',
                iconColor: 'text-blue-600',
                border: 'hover:border-blue-500/30'
              },
              {
                icon: Shield,
                title: 'Role Governance',
                description: 'Secure, granular boundaries for students, event managers, and system administrators protect platform integrity.',
                gradient: 'from-purple-500/10 to-pink-500/10',
                iconColor: 'text-purple-600',
                border: 'hover:border-purple-500/30'
              },
            ].map((feature, i) => (
              <div
                key={i}
                className={`bg-white rounded-3xl border border-slate-200/60 p-8 hover:shadow-xl hover:shadow-slate-100 ${feature.border} transition-all duration-300 transform hover:-translate-y-1.5`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-tr ${feature.gradient} ${feature.iconColor}`}
                >
                  <feature.icon className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 font-display">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 relative overflow-hidden">
        {/* Decorative backdrop glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-display">Ready to engage?</h2>
          <p className="mt-4 text-emerald-100/70 text-base max-w-xl mx-auto">
            Create your account to unlock personalized recommendations and instant registrations.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-900 hover:text-white rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/10 active:scale-95 transition-all duration-200"
          >
            Create an Account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-200/50 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs font-semibold text-slate-400 tracking-wider uppercase">
          CampusEvents &mdash; University Event Portal System
        </div>
      </footer>
    </div>
  );
}

