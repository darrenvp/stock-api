export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "NVDA";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ result: "❌ 系統錯誤：找不到 GEMINI_API_KEY 環境變數，請去 Vercel 設定。" });
    }

    // 🎯 終極降維打擊：改走 v1 穩定通道，強制繞過 v1beta 的新專案模型權限審查地雷
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `你是一位精通美股分析的 AI 助手。請幫我針對美股代號 ${symbol} 進行簡短的盤後關鍵分析與下週操作建議。請一律用繁體中文回答，並適當換行以便閱讀。`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
        }
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error?.message || "Google 伺服器拒絕請求");
    }

    // 解析 Google 官方標準回傳結構
    const aiResult = json.candidates?.[0]?.content?.parts?.[0]?.text || "暫無分析結果";

    return Response.json({ result: aiResult });

  } catch (error) {
    console.error("Gemini 核心錯誤:", error);
    return Response.json({ result: `❌ 免費 AI 分析失敗：${error.message}` });
  }
}
