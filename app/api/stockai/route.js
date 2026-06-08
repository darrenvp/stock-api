export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "NVDA";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ result: "❌ 系統錯誤：找不到 GEMINI_API_KEY 環境變數，請去 Vercel 設定。" });
    }

    // 🎯 這次真的改對了！v1beta 通道搭配 100% 穩定的元老級核心模型 gemini-pro
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

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

    // 🎯 精準提取 gemini-pro 的文字結構
    const aiResult = json.candidates?.[0]?.content?.parts?.[0]?.text || "暫無分析結果";

    return Response.json({ result: aiResult });

  } catch (error) {
    console.error("Gemini 終極錯誤:", error);
    return Response.json({ result: `❌ 免費 AI 分析失敗：${error.message}` });
  }
}
