import React from 'react';
import { Calendar, CheckCircle2, Shield, Heart, GraduationCap, Github, Mail, Globe, MapPin } from 'lucide-react';

export default function Footer({ onNavigate, onOpenTrustEngine }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white relative">
                <Calendar className="w-5 h-5 text-white" />
                <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Event<span className="text-brand-400">Sphere</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Community-Based Local Event Discovery & Trust Engine. Eliminating fraudulent, duplicate, and misleading campus events through crowdsourced validation and evidence auditing.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full text-[11px] text-slate-300 border border-slate-700/80">
              <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
              <span>Engineering College Community Project</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-brand-400 transition-colors"
                >
                  Explore All Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('submit')}
                  className="hover:text-brand-400 transition-colors"
                >
                  Submit Campus Event
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-events')}
                  className="hover:text-brand-400 transition-colors"
                >
                  My Events & Check-Ins
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-brand-400 transition-colors"
                >
                  Project Architecture & Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Trust Engine Pillars */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Trust Engine Pillars
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center justify-between">
                <span>Organizer Credibility</span>
                <span className="text-brand-400 font-bold">30%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Community Confirmation</span>
                <span className="text-purple-400 font-bold">30%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Evidence Quality</span>
                <span className="text-teal-400 font-bold">25%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Details Consistency</span>
                <span className="text-indigo-400 font-bold">15%</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenTrustEngine}
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 underline"
                >
                  Read Mathematical Formulation →
                </button>
              </li>
            </ul>
          </div>

          {/* College & Project Demonstration Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Demo Project Info
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Apex Institute of Technology, Campus Hub</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>eventsphere@college.edu</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-400 shrink-0" />
                <span>React + Vite + Tailwind + Firebase</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © 2026 EventSphere Platform. Built for Engineering College Final Year Demonstration.
          </p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-slate-300">Community Trust Engine</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
