import OpenAI from "openai";

// 🎯 第一行維持最強動態護甲，絕不卡死
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "NVDA";

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "你是一位精通美股分析的 AI 助手。請用繁體中文回答，適當換行以便閱讀。"
          },
          {
            role: "user",
            content: `請幫我針對美股代號 ${symbol} 進行簡短的盤後關鍵分析與下週操作操作建議。`
          }
        ],
        temperature
