import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Spinner } from './ui/Spinner';
import { LayoutDashboard, AlertCircle, MessageSquare, TrendingUp } from 'lucide-react';

interface Stats {
  total: number;
  highUrgency: number;
  todayCount: number;
  categoryData: { name: string; value: number }[];
  urgencyData: { name: string; value: number }[];
}

// Calm & Trust Palette
const COLORS = ['#2A4B8D', '#6272A4', '#3D9970', '#E07A5F', '#141414', '#94A3B8', '#CBD5E1'];

export const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('inquiries').select('*');
        if (error) throw error;

        const total = data.length;
        const highUrgency = data.filter(d => d.urgency === '높음').length;
        
        const today = new Date().toISOString().split('T')[0];
        const todayCount = data.filter(d => d.created_at.startsWith(today)).length;

        const catMap: Record<string, number> = {};
        data.forEach(d => {
          catMap[d.category] = (catMap[d.category] || 0) + 1;
        });
        const categoryData = Object.entries(catMap).map(([name, value]) => ({ name, value }));

        const urgencies = ['높음', '보통', '낮음'];
        const urgencyData = urgencies.map(name => ({
          name,
          value: data.filter(d => d.urgency === name).length
        }));

        setStats({ total, highUrgency, todayCount, categoryData, urgencyData });
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="py-24"><Spinner /><p className="text-center text-slate-400 mt-4 font-medium italic">데이터 지표를 정교하게 분석 중...</p></div>;
  if (!stats || stats.total === 0) return (
    <div className="bg-white rounded-3xl p-24 text-center border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="w-20 h-20 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-6">
        <LayoutDashboard className="w-10 h-10 text-slate-200" />
      </div>
      <h3 className="text-xl font-bold text-[#141414] mb-2">분석할 데이터가 부족합니다</h3>
      <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">상담 문의를 먼저 접수하시면 실시간 데이터 시각화가 활성화됩니다.</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-6 group hover:border-[#2A4B8D]/20 transition-all duration-300">
          <div className="w-14 h-14 bg-[#2A4B8D]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#2A4B8D] transition-colors">
            <MessageSquare className="text-[#2A4B8D] group-hover:text-white w-7 h-7 transition-colors" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">총 누적 상담</p>
            <p className="text-3xl font-black text-[#141414] tabular-nums">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-6 group hover:border-[#E07A5F]/20 transition-all duration-300">
          <div className="w-14 h-14 bg-[#E07A5F]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#E07A5F] transition-colors">
            <AlertCircle className="text-[#E07A5F] group-hover:text-white w-7 h-7 transition-colors" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">긴급 처리 필요</p>
            <p className="text-3xl font-black text-[#E07A5F] tabular-nums">{stats.highUrgency}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-6 group hover:border-[#3D9970]/20 transition-all duration-300">
          <div className="w-14 h-14 bg-[#3D9970]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#3D9970] transition-colors">
            <TrendingUp className="text-[#3D9970] group-hover:text-white w-7 h-7 transition-colors" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">금일 신규 접수</p>
            <p className="text-3xl font-black text-[#3D9970] tabular-nums">{stats.todayCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Chart */}
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-6 bg-[#2A4B8D] rounded-full"></div>
            <h3 className="text-xl font-bold text-[#141414]">서비스 유형별 비중</h3>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                />
                <Legend verticalAlign="bottom" height={40} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Urgency Chart */}
        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-6 bg-[#6272A4] rounded-full"></div>
            <h3 className="text-xl font-bold text-[#141414]">긴급도별 상담 분포</h3>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.urgencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                />
                <Bar 
                  dataKey="value" 
                  name="상담 건수" 
                  radius={[12, 12, 0, 0]}
                  barSize={50}
                >
                  {stats.urgencyData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.name === '높음' ? '#E07A5F' : entry.name === '보통' ? '#6272A4' : '#3D9970'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
