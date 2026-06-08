// 🎯 這是 Pages Router (pages/api/analyze.js) 的標準寫法

export default async function handler(req, res) {
  // 只允許 GET 請求
  if (req.method !== 'GET') {
    return res.status(405).json({ result: '❌ 不支援的請求方法' });
  }

  try {
    const symbol = req.query.symbol || "NVDA";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ result: "❌ 系統錯誤：找不到 GEMINI_API_KEY 環境變數，請去 Vercel 設定。" });
    }

    // 🎯 這是全宇宙唯一能通的黃金標準：必須是 v1beta 搭配 gemini-1.5-flash
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

    // 解析 Google 官方最標準的文字提取結構
    const aiResult = json.candidates?.[0]?.content?.parts?.[0]?.text || "暫無分析結果";

    return res.status(200).json({ result: aiResult });

  } catch (error) {
    console.error("Gemini 最終錯誤:", error);
    return res.status(500).json({ result: `❌ 免費 AI 分析失敗：${error.message}` });
  }
}
