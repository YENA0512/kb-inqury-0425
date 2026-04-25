import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';
import { Download, RefreshCcw, AlertCircle } from 'lucide-react';

interface InquiryRecord {
  id: number;
  created_at: string;
  customer_name: string;
  inquiry: string;
  category: string;
  urgency: string;
  summary: string;
  department: string;
}

export const InquiryList = () => {
  const [records, setRecords] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setRecords(data || []);
    } catch (err: any) {
      setError(`데이터 동기화 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const downloadCSV = () => {
    if (records.length === 0) return;

    const headers = ['시간', '고객명', '카테고리', '긴급도', '요약', '담당부서'];
    const rows = records.map(r => [
      new Date(r.created_at).toLocaleString(),
      r.customer_name,
      r.category,
      r.urgency,
      r.summary,
      r.department
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CS_Records_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#141414] flex items-center gap-2">
            상담 관리 마스터
          </h2>
          <p className="text-slate-400 text-sm">전체 문의 내역을 모니터링하고 데이터를 추출합니다.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={fetchRecords}
            className="p-3 text-[#6272A4] hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all active:scale-95"
            title="새로고침"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={downloadCSV}
            disabled={records.length === 0}
            className="flex-1 sm:flex-none px-6 py-3 bg-[#2A4B8D] text-white font-bold rounded-2xl hover:bg-[#1e3a75] shadow-lg shadow-[#2A4B8D]/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            CSV 내보내기
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-[#E07A5F]/10 border border-[#E07A5F]/20 rounded-2xl p-5 flex items-center gap-4 text-[#E07A5F]">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading && records.length === 0 ? (
        <div className="py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Spinner />
          <p className="text-center text-slate-400 mt-4 font-medium">기록을 안전하게 불러오는 중...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-bold text-[#6272A4] uppercase tracking-widest">일시</th>
                  <th className="px-8 py-5 text-xs font-bold text-[#6272A4] uppercase tracking-widest">고객 정보</th>
                  <th className="px-8 py-5 text-xs font-bold text-[#6272A4] uppercase tracking-widest">서비스 분류</th>
                  <th className="px-8 py-5 text-xs font-bold text-[#6272A4] uppercase tracking-widest">긴급도</th>
                  <th className="px-8 py-5 text-xs font-bold text-[#6272A4] uppercase tracking-widest">분석 요약</th>
                  <th className="px-8 py-5 text-xs font-bold text-[#6272A4] uppercase tracking-widest">담당팀</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center text-slate-300 italic font-medium">
                      표시할 상담 기록이 없습니다.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-8 py-6 text-sm text-slate-400 tabular-nums">
                        {new Date(record.created_at).toLocaleDateString()}<br/>
                        {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-[#141414]">{record.customer_name}</td>
                      <td className="px-8 py-6">
                        <Badge>{record.category}</Badge>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant={record.urgency === '높음' ? 'high' : record.urgency === '보통' ? 'medium' : 'low'}>
                          {record.urgency}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-600 leading-relaxed max-w-xs">{record.summary}</td>
                      <td className="px-8 py-6 text-sm text-[#2A4B8D] font-bold">{record.department}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
