import { useState } from 'react';
import { InquiryForm } from './components/InquiryForm';
import { InquiryList } from './components/InquiryList';
import { Dashboard } from './components/Dashboard';
import { MessageSquarePlus, History, ShieldCheck, LayoutDashboard } from 'lucide-react';

type Tab = 'input' | 'history' | 'dashboard';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#141414]">
      {/* Header */}
      <header className="bg-[#2A4B8D] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Customer <span className="opacity-70 font-light">Service Platform</span>
            </h1>
          </div>
          <div className="hidden sm:block text-xs text-white/60 font-medium tracking-widest uppercase">
            Trust & Empathy
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-[#2A4B8D] pt-8 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            무엇을 도와드릴까요?
          </h2>
          <p className="text-white/70 max-w-lg mx-auto leading-relaxed">
            고객님의 문의를 소중히 듣고 분석하여<br />
            가장 신뢰할 수 있는 답변을 드리기 위해 최선을 다하고 있습니다.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 -mt-10 pb-20">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-xl border border-slate-200/50 flex mb-10 backdrop-blur-md">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: '대시보드' },
            { id: 'input', icon: MessageSquarePlus, label: '문의 접수' },
            { id: 'history', icon: History, label: '관리 내역' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#2A4B8D] text-white shadow-lg'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#6272A4]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'input' && <InquiryForm />}
          {activeTab === 'history' && <InquiryList />}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center text-slate-400 text-xs border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <p className="mb-2 font-medium text-slate-500">CS Intelligence System v2.0</p>
          <p>&copy; 2026 Customer Service Platform. Focused on Trust & Calm.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
