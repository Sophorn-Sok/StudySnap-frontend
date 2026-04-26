'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Sparkles, 
  FileText, 
  LayoutDashboard, 
  BrainCircuit, 
  Mic, 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings,
  MoreVertical,
  CheckCircle2,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code2,
  Image as ImageIcon,
  Link as LinkIcon,
  Minus,
  ChevronDown,
  MessageSquare,
  Eye,
  Zap,
  Save,
  Share2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  MousePointer2,
  Clock,
  Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';

/**
 * Custom Font Size Extension
 */
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }: any) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }: any) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    } as any;
  },
});

const FONTS = ['Inter', 'Roboto', 'Serif', 'Mono', 'Verdana', 'Georgia'];
const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '32px'];

export default function EditorView() {
  const [activeFont, setActiveFont] = useState('Inter');
  const [activeSize, setActiveSize] = useState('16px');
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    immediatelyRender: false,
    content: `
      <h2>Supervised Learning</h2>
      <p>Supervised learning is a type of machine learning where the model is trained on labeled data. The algorithm learns a mapping function from input variables (X) to output variables (Y).</p>
      <h3>Types of Machine Learning</h3>
      <ol>
        <li><strong>Supervised Learning</strong> — Learning from labeled examples</li>
        <li><strong>Unsupervised Learning</strong> — Finding patterns in unlabeled data</li>
        <li><strong>Reinforcement Learning</strong> — Learning through reward and punishment</li>
        <li><strong>Semi-supervised Learning</strong> — Combination of labeled and unlabeled data</li>
      </ol>
      <h3>Neural Network Overview</h3>
      <p>A neural network consists of layers of interconnected nodes (neurons). Each connection has a weight that adjusts during training.</p>
      <pre><code># Example of a simple neuron
def sigmoid(x):
    return 1 / (1 + exp(-x))</code></pre>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] text-[17px] leading-relaxed text-gray-700 font-medium',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const handleFontChange = (font: string) => {
    setActiveFont(font);
    editor.chain().focus().setFontFamily(font).run();
    setShowFontDropdown(false);
  };

  const handleSizeChange = (size: string) => {
    setActiveSize(size);
    editor.chain().focus().setFontSize(size).run();
    setShowSizeDropdown(false);
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] text-[#1E293B] overflow-hidden font-sans antialiased">
      {/* Left Sidebar - Detailed Version */}
      <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0">
        <div className="p-6 pb-2">
          <Link href={ROUTES.DASHBOARD}>
            <div className="flex items-center gap-2 mb-8 cursor-pointer">
              <Logo size="md" />
            </div>
          </Link>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search notes..." 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all outline-none"
            />
          </div>

          <Button className="w-full justify-start gap-3 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-100 mb-8">
            <Plus size={18} /> New Note
          </Button>

          <nav className="space-y-1">
            <SidebarLink icon={<LayoutDashboard size={18} />} label="Dashboard" href={ROUTES.DASHBOARD} />
            <SidebarLink icon={<FileText size={18} />} label="Notes" href={ROUTES.NOTES} count={25} active />
            <SidebarLink icon={<BrainCircuit size={18} />} label="Flashcards" href={ROUTES.FLASHCARDS} />
            <SidebarLink icon={<Mic size={18} />} label="Meetings" href="#" />
            <SidebarLink icon={<BarChart3 size={18} />} label="Analytics" href="#" />
            <SidebarLink icon={<Users size={18} />} label="Shared" href="#" />
            <SidebarLink icon={<CreditCard size={18} />} label="Pricing" href="#" />
            <SidebarLink icon={<Settings size={18} />} label="Settings" href="#" />
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          <div className="mb-6">
            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              <span>Folders</span>
              <Plus size={14} className="cursor-pointer hover:text-blue-600" />
            </div>
            <div className="space-y-1">
              <FolderLink label="Computer Science" count={12} />
              <FolderLink label="Mathematics" count={8} />
              <FolderLink label="Physics" count={5} />
            </div>
          </div>

          <div className="mb-6">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Recent</div>
            <div className="space-y-1">
              <RecentItem label="ML Lecture Notes" active />
              <RecentItem label="Data Structures" />
              <RecentItem label="Linear Algebra" favorite />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">H</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">Hour</div>
              <div className="text-[10px] text-gray-400 truncate">hour@gmail.com</div>
            </div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Editor Toolbar */}
        <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center px-4 gap-1 shrink-0 overflow-visible scrollbar-hide relative z-50">
          <ToolbarGroup>
            <div className="relative">
              <ToolbarDropdown label={activeFont} width="w-28" onClick={() => { setShowFontDropdown(!showFontDropdown); setShowSizeDropdown(false); }} />
              {showFontDropdown && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] py-1">
                  {FONTS.map(f => (
                    <button key={f} onClick={() => handleFontChange(f)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold hover:bg-blue-50 text-gray-700 transition-colors">
                      {f}
                      {activeFont === f && <Check size={14} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <ToolbarDropdown label={activeSize} width="w-16" onClick={() => { setShowSizeDropdown(!showSizeDropdown); setShowFontDropdown(false); }} />
              {showSizeDropdown && (
                <div className="absolute top-full left-0 mt-1 w-24 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] py-1">
                  {FONT_SIZES.map(s => (
                    <button key={s} onClick={() => handleSizeChange(s)} className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold hover:bg-blue-50 text-gray-700 transition-colors">
                      {s}
                      {activeSize === s && <Check size={14} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup>
            <ToolbarButton icon={<Undo2 size={16} />} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
            <ToolbarButton icon={<Redo2 size={16} />} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup>
            <ToolbarButton 
              icon={<Bold size={16} />} 
              active={editor.isActive('bold')} 
              onClick={() => editor.chain().focus().toggleBold().run()} 
            />
            <ToolbarButton 
              icon={<Italic size={16} />} 
              active={editor.isActive('italic')} 
              onClick={() => editor.chain().focus().toggleItalic().run()} 
            />
            <ToolbarButton 
              icon={<Underline size={16} />} 
              active={editor.isActive('underline')} 
              onClick={() => editor.chain().focus().toggleUnderline().run()} 
            />
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup>
            <ToolbarButton 
              icon={<Heading1 size={16} />} 
              active={editor.isActive('heading', { level: 1 })} 
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
            />
            <ToolbarButton 
              icon={<Heading2 size={16} />} 
              active={editor.isActive('heading', { level: 2 })} 
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
            />
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup>
            <ToolbarButton 
              icon={<List size={16} />} 
              active={editor.isActive('bulletList')} 
              onClick={() => editor.chain().focus().toggleBulletList().run()} 
            />
            <ToolbarButton 
              icon={<ListOrdered size={16} />} 
              active={editor.isActive('orderedList')} 
              onClick={() => editor.chain().focus().toggleOrderedList().run()} 
            />
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup>
            <ToolbarButton 
              icon={<AlignLeft size={16} />} 
              active={editor.isActive({ textAlign: 'left' })} 
              onClick={() => editor.chain().focus().setTextAlign('left').run()} 
            />
            <ToolbarButton 
              icon={<AlignCenter size={16} />} 
              active={editor.isActive({ textAlign: 'center' })} 
              onClick={() => editor.chain().focus().setTextAlign('center').run()} 
            />
            <ToolbarButton 
              icon={<AlignRight size={16} />} 
              active={editor.isActive({ textAlign: 'right' })} 
              onClick={() => editor.chain().focus().setTextAlign('right').run()} 
            />
          </ToolbarGroup>
          <ToolbarDivider />
          <ToolbarGroup>
            <ToolbarButton 
              icon={<Code2 size={16} />} 
              active={editor.isActive('codeBlock')} 
              onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
            />
            <ToolbarButton icon={<ImageIcon size={16} />} />
            <ToolbarButton icon={<LinkIcon size={16} />} />
            <ToolbarButton icon={<Minus size={16} />} />
          </ToolbarGroup>
        </header>

        <div className="flex-1 flex overflow-hidden bg-white relative">
          <main className="flex-1 overflow-y-auto px-12 py-10 custom-scrollbar bg-[#F8FAFC]">
            <div className="max-w-4xl mx-auto flex flex-col h-full">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-6 shrink-0">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock size={14} /> Last edited 2 hours ago
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={14} /> Only you
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} /> 3 comments
                  </div>
                </div>
                <div className="text-emerald-500 font-semibold bg-emerald-50 px-2 py-1 rounded-md">Auto-saved</div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 shrink-0">
                <span>Notes</span>
                <ChevronRight size={10} />
                <span>Computer Science</span>
                <ChevronRight size={10} />
                <span className="text-gray-600">Machine Learning</span>
              </div>

              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight shrink-0">Machine Learning Lecture Notes</h1>
              <p className="text-sm font-medium text-gray-400 mb-10 flex items-center gap-2 shrink-0">
                CS 229 · Prof. Andrew Ng · Lecture 4 — March 18, 2026
              </p>

              {/* Tiptap Editor Content */}
              <div className="flex-1 bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 p-12 min-h-[500px] mb-8 relative flex flex-col cursor-text editor-container overflow-hidden" onClick={() => editor.chain().focus().run()}>
                <style>{`
                  .editor-container .ProseMirror {
                    flex: 1;
                    padding-right: 20px;
                  }
                  .editor-container .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                  }
                `}</style>
                <EditorContent editor={editor} />
                
                <div className="absolute top-12 right-6 w-1.5 h-64 bg-gray-100 rounded-full overflow-hidden opacity-40">
                  <div className="w-full h-20 bg-gray-400 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 font-medium px-4 mb-10 shrink-0">
                <div className="flex gap-4">
                  <span>190 words</span>
                  <span>1404 characters</span>
                </div>
                <span>1 min read</span>
              </div>
            </div>
          </main>

          {/* Right Sidebar - AI Tools & Details */}
          <aside className="w-80 bg-white border-l border-[#E2E8F0] p-8 overflow-y-auto shrink-0 flex flex-col gap-8 custom-scrollbar">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-100">
                    <Zap size={16} />
                  </div>
                  <h3 className="text-lg font-bold">AI Tools</h3>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full tracking-widest">Active</span>
              </div>

              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">AI Productivity</h4>
                <AIActionCard 
                  icon={<FileText size={18} className="text-blue-500" />}
                  title="Generate Summary"
                  description="Condense notes into key points"
                />
                <AIActionCard 
                  icon={<BrainCircuit size={18} className="text-purple-500" />}
                  title="Create Flashcards"
                  description="Auto-generate study cards"
                />
                <AIActionCard 
                  icon={<Zap size={18} className="text-indigo-500" />}
                  title="Suggest Tags"
                  description="AI-powered categorization"
                />
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-3 gap-3">
                <QuickActionButton icon={<HelpCircle size={16} />} label="Explain Concept" color="text-blue-500 bg-blue-50/50" />
                <QuickActionButton icon={<Lightbulb size={16} />} label="Quiz Me" color="text-purple-500 bg-purple-50/50" />
                <QuickActionButton icon={<MousePointer2 size={16} />} label="Ask AI" color="text-indigo-500 bg-indigo-50/50" />
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-6">Note Details</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FileText size={16} /> Folder
                  </div>
                  <span className="font-bold text-gray-800">Computer Science</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                    <Zap size={16} /> Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Tag label="ML" color="bg-blue-50 text-blue-600" />
                    <Tag label="AI" color="bg-indigo-50 text-indigo-600" />
                    <Plus size={16} className="text-gray-300 ml-1 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-8">
              <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 shadow-xl shadow-blue-100 rounded-2xl transition-transform active:scale-[0.98]">
                <Plus size={18} /> Generate Flashcards
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 gap-2 text-sm font-bold border-gray-100">
                  <Save size={16} /> Save
                </Button>
                <Button variant="outline" className="h-12 gap-2 text-sm font-bold border-gray-100">
                  <Share2 size={16} /> Share
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, href, count, active = false }: { icon: React.ReactNode, label: string, href: string, count?: number, active?: boolean }) {
  return (
    <Link href={href} className="block group">
      <div className={`
        flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
        ${active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
      `}>
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-sm tracking-wide">{label}</span>
        </div>
        {count && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 tracking-tighter'}`}>
            {count}
          </span>
        )}
      </div>
    </Link>
  );
}

function FolderLink({ label, count }: { label: string, count: number }) {
  return (
    <div className="flex items-center justify-between px-2 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-gray-300 group-hover:text-blue-500" />
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-[10px] font-bold text-gray-300">{count}</span>
    </div>
  );
}

function RecentItem({ label, active = false, favorite = false }: { label: string, active?: boolean, favorite?: boolean }) {
  return (
    <div className={`
      flex items-center justify-between px-2 py-2 text-sm rounded-lg cursor-pointer transition-colors
      ${active ? 'text-gray-900 font-bold' : 'text-gray-500 hover:bg-gray-50'}
    `}>
      <div className="flex items-center gap-2">
        <span className="text-gray-300">#</span>
        <span className="truncate w-32">{label}</span>
      </div>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>}
      {favorite && <Zap size={12} className="text-amber-400 fill-amber-400" />}
    </div>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5 bg-white p-1 rounded-lg shrink-0">{children}</div>;
}

function ToolbarButton({ icon, active = false, onClick, disabled = false }: { icon: React.ReactNode, active?: boolean, onClick?: () => void, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-20'}`}
    >
      {icon}
    </button>
  );
}

function ToolbarDropdown({ label, width, onClick }: { label: string, width: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center justify-between ${width} px-3 py-2 text-xs font-bold text-gray-600 bg-gray-50/50 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200 shrink-0`}
    >
      <span className="truncate">{label}</span>
      <ChevronDown size={14} className="text-gray-400 ml-1" />
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-100 mx-2 flex-shrink-0" />;
}

function AIActionCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-50 hover:border-blue-100 hover:shadow-lg shadow-gray-100/50 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-gray-50 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</div>
          <div className="text-[10px] text-gray-400 font-medium">{description}</div>
        </div>
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-600" />
    </div>
  );
}

function QuickActionButton({ icon, label, color }: { icon: React.ReactNode, label: string, color: string }) {
  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer hover:shadow-md transition-all group h-24 text-center border border-white hover:border-gray-50`}>
      <div className={`p-3 rounded-xl mb-3 ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="text-[9px] font-extrabold uppercase tracking-tight text-gray-500 group-hover:text-gray-900">{label}</span>
    </div>
  );
}

function Tag({ label, color }: { label: string, color: string }) {
  return (
    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${color}`}>
      {label}
    </span>
  );
}
