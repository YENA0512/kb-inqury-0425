import { useState } from 'react';
import { analyzeInquiry, type AnalysisResult } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import { Badge } from './ui/Badge';
import { Spinner } from './ui/Spinner';
import { AlertCircle, CheckCircle2, User, FileText, Send, Save } from 'lucide-react';

export const InquiryForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [inquiry, setInquiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleClassify = async () => {
    if (!customerName || !inquiry) {
      setError('고객 성함과 문의 내용을 빠짐없이 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const analysis = await analyzeInquiry(inquiry);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || '데이터 분석 중 일시적인 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || !customerName || !inquiry) return;

    try {
      const { error: saveError } = await supabase.from('inquiries').insert([
        {
          customer_name: customerName,
          inquiry,
          category: result.category,
          urgency: result.urgency,
          summary: result.summary,
          department: result.department,
          script: result.script,
        },
      ]);

      if (saveError) throw saveError;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(`저장 중 오류가 발생했습니다: ${err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#141414] flex items-center gap-2">
            문의 분석 요청
          </h2>
          <p className="text-slate-400 text-sm">정확한 분석을 위해 상세한 문의 내용을 입력해주세요.</p>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 ml-1">
              <User className="w-4 h-4 text-[#2A4B8D]" /> 고객 성함
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="예: 홍길동"
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#2A4B8D]/5 focus:border-[#2A4B8D] outline-none transition-all duration-300"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 ml-1">
              <FileText className="w-4 h-4 text-[#2A4B8D]" /> 문의 내용
            </label>
            <textarea
              rows={6}
              value={inquiry}
              onChange={(e) => setInquiry(e.target.value)}
              placeholder="상담 내용을 상세히 입력하시면 더욱 정확한 분류가 가능합니다..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#2A4B8D]/5 focus:border-[#2A4B8D] outline-none transition-all duration-300 resize-none leading-relaxed"
            />
          </div>

          <button
            onClick={handleClassify}
            disabled={loading}
            className="w-full py-4 bg-[#2A4B8D] text-white font-bold rounded-2xl hover:bg-[#1e3a75] shadow-lg shadow-[#2A4B8D]/20 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Spinner /> : (
              <>
                <Send className="w-5 h-5" />
                AI 분석 시작
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-[#E07A5F]/10 border border-[#E07A5F]/20 rounded-2xl p-5 flex items-start gap-4 text-[#E07A5F] animate-in shake duration-500">
          <AlertCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div className="bg-white rounded-3xl shadow-2xl border border-[#2A4B8D]/10 p-8 space-y-8 animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center border-b border-slate-100 pb-6">
            <h3 className="text-xl font-bold text-[#141414]">분류 및 처방 결과</h3>
            <div className="flex gap-2.5">
              <Badge className="py-1 px-4">{result.category}</Badge>
              <Badge 
                variant={result.urgency === '높음' ? 'high' : result.urgency === '보통' ? 'medium' : 'low'}
                className="py-1 px-4"
              >
                {result.urgency}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">핵심 요약</p>
              <p className="text-lg text-slate-800 font-semibold leading-snug">{result.summary}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">배정 부서</p>
              <p className="text-lg text-[#2A4B8D] font-bold">{result.department}</p>
            </div>
          </div>

          <div className="space-y-3 bg-[#F8F9FA] p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#6272A4]"></div>
            <p className="text-xs text-[#6272A4] font-bold uppercase tracking-widest ml-2">추천 상담 스크립트</p>
            <p className="text-[#141414] leading-relaxed font-medium italic ml-2">"{result.script}"</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saved}
            className={`w-full py-4 flex justify-center items-center gap-2 font-bold rounded-2xl transition-all shadow-lg ${
              saved 
              ? 'bg-[#3D9970] text-white shadow-[#3D9970]/20' 
              : 'bg-[#6272A4] text-white hover:bg-[#4d5c8a] shadow-[#6272A4]/20'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-6 h-6" />
                기록 저장 완료
              </>
            ) : (
              <>
                <Save className="w-6 h-6" />
                플랫폼에 저장하기
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
