import OpenAI from "openai";

// 🎯 確保維持最高動態護甲，絕不卡死網頁
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
            content: `請幫我針對美股代號 ${symbol} 進行簡短的盤後關鍵分析與下週操作建議。`
          }
        ],
        temperature: 0.7,
      });

      const aiResult = response.choices[0].message.content;
      
      // 🎯 精準對齊前端的 json.result
      return Response.json({ result: aiResult });

    } catch (openAiError) {
      console.error("OpenAI API 失敗:", openAiError);
      return Response.json({ 
        result: `❌ AI 分析失敗：${openAiError.message || "請檢查 Vercel 的 OPENAI_API_KEY 是否正確或過期。"}` 
      });
    }

  } catch (error) {
    console.error("系統錯誤:", error);
    return Response.json({ result: `❌ 系統錯誤：${error.message}` });
  }
}      console.error("OpenAI API 失敗:", openAiError);
      return Response.json({ 
        result: `❌ AI 分析失敗：${openAiError.message || "請檢查 Vercel 的 OPENAI_API_KEY 是否正確或過期。"}` 
      });
    }

  } catch (error) {
    console.error("系統錯誤:", error);
    return Response.json({ result: `❌ 系統錯誤：${error.message}` });
  }
}
