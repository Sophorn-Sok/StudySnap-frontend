'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { User, Lock, Bell, MessageCircle, Clock, CheckCircle, Star, Search, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [darkMode, setDarkMode] = useState(false);
  const [cloudSync, setCloudSync] = useState(true);

  useEffect(() => {
    // Set initial dark mode based on html class
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  // Reusable custom soft shadow classes to match the design
  const cardShadow = "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] dark:shadow-none";
  const inputShadow = "shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100 dark:border-slate-700 dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]";

  return (
    <>
      <Navbar />
      <DashboardLayout sidebar={<Sidebar />}>
        {/* Main background matching the soft vibe */}
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-10 font-sans text-slate-800 dark:text-slate-100 overflow-x-hidden transition-colors">
          
          {/* Top header/search area - optional but good for spacing */}
          <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
             <div className="flex-1 max-w-md relative hidden md:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Find related settings..." 
                 className="w-full bg-slate-200/50 dark:bg-slate-800/50 border-0 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-600 dark:text-slate-300 placeholder:text-slate-400 transition-colors"
               />
             </div>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-72 flex flex-col gap-6">
              
              {/* Profile Card */}
              <div className={`bg-white dark:bg-slate-800 rounded-3xl p-6 flex flex-col items-center text-center transition-colors ${cardShadow}`}>
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 p-1">
                    <img 
                      src="https://api.dicebear.com/7.x/notionists/svg?seed=Jane" 
                      alt="Profile" 
                      className="w-full h-full rounded-full bg-white dark:bg-slate-800 object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-400 border-4 border-white dark:border-slate-800 rounded-full transition-colors"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Alex Student</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 mt-1">Computer Science Major</p>
                
                <div className="flex gap-3 w-full">
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full py-2.5 font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all">
                    Edit Profile
                  </button>
                  <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all shrink-0">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Card */}
              <div className={`bg-white dark:bg-slate-800 rounded-3xl p-4 flex flex-col gap-2 transition-colors ${cardShadow}`}>
                <button 
                  onClick={() => setActiveTab('Personal Info')}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                    activeTab === 'Personal Info' 
                      ? 'bg-slate-50 dark:bg-slate-700 shadow-sm text-blue-500 font-semibold' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className={`p-2 rounded-full ${activeTab === 'Personal Info' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  Personal Info
                </button>
                
                <button 
                  onClick={() => setActiveTab('Security')}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                    activeTab === 'Security' 
                      ? 'bg-slate-50 dark:bg-slate-700 shadow-sm text-blue-500 font-semibold' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className={`p-2 rounded-full ${activeTab === 'Security' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  Security
                </button>

                <button 
                  onClick={() => setActiveTab('Notifications')}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                    activeTab === 'Notifications' 
                      ? 'bg-slate-50 dark:bg-slate-700 shadow-sm text-blue-500 font-semibold' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50/50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <div className={`p-2 rounded-full ${activeTab === 'Notifications' ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-700'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  Notifications
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Main Settings Card */}
              <div className={`bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 lg:p-10 transition-colors ${cardShadow}`}>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Account Settings</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Manage your personal information and study preferences.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider ml-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Alex Student"
                      className={`w-full bg-slate-50 dark:bg-slate-900 rounded-2xl px-5 py-3.5 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${inputShadow}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider ml-2">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="alex@studysnap.com"
                      className={`w-full bg-slate-50 dark:bg-slate-900 rounded-2xl px-5 py-3.5 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${inputShadow}`}
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-10">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider ml-2">Study Bio</label>
                  <textarea 
                    rows={3}
                    defaultValue="Computer Science major focusing on AI and software engineering. Passionate about effective learning techniques and building cool apps."
                    className={`w-full bg-slate-50 dark:bg-slate-900 rounded-3xl px-6 py-5 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${inputShadow}`}
                  />
                </div>

                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Workspace Preferences</h3>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  {/* Toggle Card 1 */}
                  <div className={`flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 flex items-center justify-between ${inputShadow}`}>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Dark Mode</span>
                    <button 
                      onClick={toggleDarkMode}
                      className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all transform ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Toggle Card 2 */}
                  <div className={`flex-1 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 flex items-center justify-between ${inputShadow}`}>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Cloud Sync</span>
                    <button 
                      onClick={() => setCloudSync(!cloudSync)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${cloudSync ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all transform ${cloudSync ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 sm:max-w-xs bg-blue-500 hover:bg-blue-600 text-white rounded-full py-3.5 font-bold shadow-xl shadow-blue-500/30 transition-all">
                    Save All Changes
                  </button>
                  <button className="flex-1 sm:max-w-xs bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full py-3.5 font-bold transition-all">
                    Discard
                  </button>
                </div>
              </div>

              {/* Stats Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className={`bg-white dark:bg-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-colors ${cardShadow}`}>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500 flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="text-3xl font-black text-slate-800 dark:text-slate-100">248</h4>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Hours Studied</p>
                </div>

                <div className={`bg-white dark:bg-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-colors ${cardShadow}`}>
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-500 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-3xl font-black text-slate-800 dark:text-slate-100">12</h4>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Completed Notes</p>
                </div>

                <div className={`bg-white dark:bg-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-colors ${cardShadow}`}>
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-500 flex items-center justify-center mb-4">
                    <Star className="w-6 h-6" />
                  </div>
                  <h4 className="text-3xl font-black text-slate-800 dark:text-slate-100">4.9</h4>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Avg Quiz Score</p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
