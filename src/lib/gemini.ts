import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const client = new GoogleGenAI({ 
  apiKey: apiKey || ''
});

export interface AnalysisResult {
  category: '보험금청구' | '계약변경' | '해지' | '상품문의' | '대출' | '카드' | '기타';
  urgency: '높음' | '보통' | '낮음';
  summary: string;
  department: string;
  script: string;
}

export const analyzeInquiry = async (inquiryText: string): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error('환경변수 VITE_GEMINI_API_KEY가 설정되지 않았습니다.');
  }

  const prompt = `
당신은 KB금융그룹의 고객 문의 분류 전문가입니다. 아래 고객 문의 내용을 분석하여 지정된 JSON 형식으로만 응답하세요.

[분류 규칙]
1. 카테고리: 보험금청구, 계약변경, 해지, 상품문의, 대출, 카드, 기타 중 하나 선택
2. 긴급도:
   - 높음: 사고, 분실, 도난, 긴급 의료, 해외 사고 등 즉시 처리 필요
   - 보통: 일반 문의, 상품 가입, 변경 요청
   - 낮음: 단순 확인, 정보 요청
3. 담당부서:
   - 보험금 관련 -> 보상심사팀
   - 대출 관련 -> 여신심사팀
   - 카드 분실/도난 -> 카드관리팀
   - 적금/예금 -> 수신팀
   - 그 외 일반 -> 고객지원팀

[고객 문의 내용]
"${inquiryText}"

[지시 사항]
응답은 아래 JSON 형식으로만. 마크다운 코드블록이나 설명 텍스트 없이 순수 JSON만 출력.

{
  "category": "카테고리",
  "urgency": "높음|보통|낮음",
  "summary": "한 줄 요약",
  "department": "담당부서",
  "script": "응대 스크립트 (3문장 이내)"
}
`;

  try {
    const result = await client.models.generateContent({
      model: 'gemini-3-flash-preview', // 확인된 정확한 모델명 적용
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });
    
    const text = result.text || '';

    // 마크다운 코드 블록 제거 전처리
    const cleanedText = text.replace(/```json|```/g, '').trim();

    try {
      return JSON.parse(cleanedText) as AnalysisResult;
    } catch (parseError) {
      console.error('JSON 파싱 실패:', cleanedText);
      throw new Error(`AI 응답 해석 실패: ${cleanedText.substring(0, 200)}...`);
    }
  } catch (error: any) {
    console.error('Gemini API 호출 에러:', error);
    throw error;
  }
};
