import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "NVDA";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ result: "❌ 系統錯誤：找不到 GEMINI_API_KEY 環境變數，請去 Vercel 設定。" });
    }

    // 🎯 初始化最新官方萬用 SDK 護甲
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 🎯 強制指定最通用的免費模型，由 SDK 底層自動對齊最正確的 Google 通道
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `你是一位精通美股分析的 AI 助手。請幫我針對美股代號 ${symbol} 進行簡短的盤後關鍵分析與下週操作建議。請一律用繁體中文回答，並適當換行以便閱讀。`,
    });

    // 🎯 提取由 SDK 成功帶回的文字
    const aiResult = response.text || "暫無分析結果";

    return Response.json({ result: aiResult });

  } catch (error) {
    console.error("Gemini SDK 發生嚴重錯誤:", error);
    return Response.json({ result: `❌ 免費 AI 分析失敗：${error.message}` });
  }
}
