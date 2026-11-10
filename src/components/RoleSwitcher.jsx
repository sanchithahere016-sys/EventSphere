import React, { useState } from 'react';
import { Shield, User, Award, RefreshCw, ChevronDown, ChevronUp, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function RoleSwitcher() {
  const { currentUser, switchDemoRole } = useAuth();
  const { resetDemoData } = useEvents();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      role: 'Normal User',
      name: 'Aarav Patel (Student)',
      desc: 'Discover events, confirm details, scan QR passes & bookmark',
      icon: User,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      role: 'Event Organizer',
      name: 'Kavya Sharma (IEEE Lead)',
      desc: 'Submit events with evidence, test duplicate alerts, view scans',
      icon: Award,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      role: 'Administrator',
      name: 'Dr. Evelyn Vance (Dean/Admin)',
      desc: 'Review submissions, audit documents, approve/reject & manage reports',
      icon: Shield,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  const handleRoleSelect = (r) => {
    switchDemoRole(r);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 left-5 z-40 font-sans">
      {/* Floating Pill / Toggle Button */}
      <div className="flex items-center gap-1.5 p-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-soft-lg border border-slate-200/90 text-xs">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-800 font-bold"
          title="Switch Demo Role for Live Project Presentation"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-extrabold">
            Demo Persona:
          </span>
          <span className="font-bold text-brand-600">
            {currentUser ? currentUser.role : 'Guest'}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={resetDemoData}
          className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-xl transition-colors"
          title="Reset All Events & Data to Fresh Demo State"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Expanded Persona Switcher Tray */}
      {isOpen && (
        <div className="absolute bottom-12 left-0 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 space-y-3 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold text-slate-900">
                Live Presentation Switcher
              </p>
              <p className="text-[10px] text-slate-400">
                1-click switch between roles to test workflows
              </p>
            </div>
            <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              Demo Mode
            </span>
          </div>

          <div className="space-y-2">
            {roles.map(r => {
              const Icon = r.icon;
              const isSelected = currentUser?.role === r.role;

              return (
                <button
                  key={r.role}
                  onClick={() => handleRoleSelect(r.role)}
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${r.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {r.role}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 truncate">
                      {r.name}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {r.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              onClick={resetDemoData}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Sample Data</span>
            </button>
            <span className="text-slate-400">Instant College Demo</span>
          </div>
        </div>
      )}
    </div>
  );
}
