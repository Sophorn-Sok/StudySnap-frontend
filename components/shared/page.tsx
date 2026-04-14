import React from 'react';
import {
  UserPlus,
  Plus,
  Users,
  ChevronRight,
  Pencil,
  Eye,
  ExternalLink,
  BookOpen,
  ChevronDown,
  Send,
  MessageSquare,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';

export default function SharingPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Shared</h1>
          <p className="text-gray-500 mt-2">Collaborate with your study groups</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="text-gray-700 bg-white">
            <UserPlus className="w-4 h-4" />
            Invite Users
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Study Groups Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Study Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-2 text-gray-900 font-bold mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-[15px]">Machine Learning Group</h3>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#1e40af] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-50 relative">A</div>
                <div className="w-8 h-8 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-40 relative">B</div>
                <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-30 relative">C</div>
                <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-20 relative">D</div>
                <div className="w-8 h-8 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-10 relative">E</div>
              </div>
              <span className="text-sm text-gray-400">5 members</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">12 notes &middot; 4 decks</p>
            <button className="text-blue-500 text-sm font-semibold flex items-center hover:text-blue-600 transition-colors">
              Open Group <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-2 text-gray-900 font-bold mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-[15px]">Organic Chemistry</h3>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#ec4899] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-30 relative">A</div>
                <div className="w-8 h-8 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-20 relative">B</div>
                <div className="w-8 h-8 rounded-full bg-[#f97316] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-10 relative">C</div>
              </div>
              <span className="text-sm text-gray-400">3 members</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">8 notes &middot; 6 decks</p>
            <button className="text-blue-500 text-sm font-semibold flex items-center hover:text-blue-600 transition-colors">
              Open Group <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-2 text-gray-900 font-bold mb-4">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-[15px]">World History Study</h3>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-40 relative">A</div>
                <div className="w-8 h-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-30 relative">B</div>
                <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-20 relative">C</div>
                <div className="w-8 h-8 rounded-full bg-[#f59e0b] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-10 relative">D</div>
              </div>
              <span className="text-sm text-gray-400">4 members</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">15 notes &middot; 3 decks</p>
            <button className="text-blue-500 text-sm font-semibold flex items-center hover:text-blue-600 transition-colors">
              Open Group <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-2 text-gray-900 font-bold mb-4">
              <Users className="w-5 h-5 text-gray-400" />
              <h3 className="text-[15px]">AI Ethics Seminar</h3>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#ef4444] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-40 relative">A</div>
                <div className="w-8 h-8 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-30 relative">B</div>
                <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-20 relative">C</div>
                <div className="w-8 h-8 rounded-full bg-[#ec4899] text-white flex items-center justify-center text-xs border-2 border-white font-medium z-10 relative">D</div>
              </div>
              <span className="text-sm text-gray-400">4 members</span>
            </div>
            <p className="text-sm text-gray-500 mb-6">6 notes &middot; 2 decks</p>
            <button className="text-blue-500 text-sm font-semibold flex items-center hover:text-blue-600 transition-colors">
              Open Group <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Shared Notes Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Shared Notes</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-medium">Title</th>
                <th className="py-4 px-6 font-medium">Owner</th>
                <th className="py-4 px-6 font-medium">Updated</th>
                <th className="py-4 px-6 font-medium">Access</th>
                <th className="py-4 px-6 font-medium w-32"></th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-gray-900 font-semibold">Neural Networks Basics</td>
                <td className="py-4 px-6 text-gray-500">John Doe</td>
                <td className="py-4 px-6 text-gray-400 flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>2 hours ago</span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-green-50 text-green-600 font-medium text-xs">
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-blue-500 font-medium text-sm flex items-center justify-end hover:text-blue-600">
                    Open <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-gray-900 font-semibold">React Hooks Deep Dive</td>
                <td className="py-4 px-6 text-gray-500">Anna Kim</td>
                <td className="py-4 px-6 text-gray-400 flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>5 hours ago</span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 font-medium text-xs">
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-blue-500 font-medium text-sm flex items-center justify-end hover:text-blue-600">
                    Open <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-gray-900 font-semibold">Linear Algebra Notes</td>
                <td className="py-4 px-6 text-gray-500">Mike Chen</td>
                <td className="py-4 px-6 text-gray-400 flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>1 day ago</span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-green-50 text-green-600 font-medium text-xs">
                    <Pencil className="w-3 h-3" />
                    <span>Edit</span>
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-blue-500 font-medium text-sm flex items-center justify-end hover:text-blue-600">
                    Open <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-gray-900 font-semibold">Data Structures Summary</td>
                <td className="py-4 px-6 text-gray-500">Sara Lee</td>
                <td className="py-4 px-6 text-gray-400 flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>3 days ago</span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 font-medium text-xs">
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-blue-500 font-medium text-sm flex items-center justify-end hover:text-blue-600">
                    Open <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </section>

      {/* Shared Flashcard Decks Section */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Shared Flashcard Decks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Deck 1 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="flex items-center space-x-2 text-gray-900 font-bold mb-2 text-[15px]">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <h3>ML Vocabulary</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">48 cards &middot; by John Doe</p>
            
            <div className="mt-auto">
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mb-5">72% complete</p>
              
              <button className="w-full py-2.5 bg-[#eff6ff] text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                Study
              </button>
            </div>
          </div>

          {/* Deck 2 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="flex items-center space-x-2 text-gray-900 font-bold mb-2 text-[15px]">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <h3>Chemistry Formulas</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">36 cards &middot; by Anna Kim</p>
            
            <div className="mt-auto">
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mb-5">45% complete</p>
              
              <button className="w-full py-2.5 bg-[#eff6ff] text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                Study
              </button>
            </div>
          </div>

          {/* Deck 3 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="flex items-center space-x-2 text-gray-900 font-bold mb-2 text-[15px]">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <h3>History Dates</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">64 cards &middot; by Mike Chen</p>
            
            <div className="mt-auto">
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mb-5">30% complete</p>
              
              <button className="w-full py-2.5 bg-[#eff6ff] text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                Study
              </button>
            </div>
          </div>

          {/* Deck 4 */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="flex items-center space-x-2 text-gray-900 font-bold mb-2 text-[15px]">
              <BookOpen className="w-5 h-5 text-purple-500" />
              <h3>AI Key Concepts</h3>
            </div>
            <p className="text-sm text-gray-400 mb-6">28 cards &middot; by Sara Lee</p>
            
            <div className="mt-auto">
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '86%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mb-5">86% complete</p>
              
              <button className="w-full py-2.5 bg-[#eff6ff] text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors">
                Study
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite Users */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] self-start">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Invite Users</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer">
                <option>View</option>
                <option>Edit</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <Button variant="primary" className="h-11 px-6 rounded-xl justify-center">
              <Send className="w-4 h-4" />
              Send Invite
            </Button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center space-x-2 text-gray-900 font-bold mb-6">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg">Activity Feed</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex space-x-4">
              <div className="relative mt-1.5 flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                <div className="w-px h-full bg-gray-100 absolute top-2.5 bottom-[-24px]"></div>
              </div>
              <div>
                <p className="text-[15px] text-gray-700"><span className="font-semibold text-gray-900">John</span> added a new note to ML Group</p>
                <p className="text-xs text-gray-400 mt-0.5">10 min ago</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="relative mt-1.5 flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                <div className="w-px h-full bg-gray-100 absolute top-2.5 bottom-[-24px]"></div>
              </div>
              <div>
                <p className="text-[15px] text-gray-700"><span className="font-semibold text-gray-900">Anna</span> updated Chemistry flashcards</p>
                <p className="text-xs text-gray-400 mt-0.5">25 min ago</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="relative mt-1.5 flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                <div className="w-px h-full bg-gray-100 absolute top-2.5 bottom-[-24px]"></div>
              </div>
              <div>
                <p className="text-[15px] text-gray-700">You joined AI Ethics Seminar</p>
                <p className="text-xs text-gray-400 mt-0.5">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="relative mt-1.5 flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
                <div className="w-px h-full bg-gray-100 absolute top-2.5 bottom-[-24px]"></div>
              </div>
              <div>
                <p className="text-[15px] text-gray-700"><span className="font-semibold text-gray-900">Sara</span> shared Data Structures notes</p>
                <p className="text-xs text-gray-400 mt-0.5">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="relative mt-1.5 flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50"></div>
              </div>
              <div>
                <p className="text-[15px] text-gray-700"><span className="font-semibold text-gray-900">Mike</span> completed Linear Algebra deck</p>
                <p className="text-xs text-gray-400 mt-0.5">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
