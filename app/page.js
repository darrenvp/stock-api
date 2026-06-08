export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ result: '❌ 方法錯誤' });

  try {
    const symbol = req.query.symbol || "NVDA";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) return res.status(500).json({ result: "❌ 找不到 API_KEY" });

    // 🎯 唯一標準：v1beta + gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `你是一位精通美股分析的 AI 助手。請幫我針對美股代號 ${symbol} 進行簡短的盤後關鍵分析與下週操作建議。請一律用繁體中文回答，並適當換行以便閱讀。` }] }]
      }),
    });

    const json = await response.json();
    return res.status(200).json({ result: json.candidates?.[0]?.content?.parts?.[0]?.text || "暫無分析結果" });
  } catch (e) {
    return res.status(500).json({ result: `❌ 錯誤：${e.message}` });
  }
}
