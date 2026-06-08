export const dynamic = "force-dynamic";
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return Response.json({ error: "Missing symbol" }, { status: 400 });
    }

    const apiKey = process.env.FINNHUB_KEY;
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    // 💡 檢查是否有正確抓到 Finnhub 的歷史/盤後數據 (c 代表收盤價或當前價)
    // 如果 Finnhub 沒給數據，我們給它預設值以免前端閃退
    const currentPrice = data.c || data.pc || 0;
    const changePercent = data.dp !== undefined ? `${data.dp.toFixed(2)}%` : "0.00%";

    // 🛠️ 重新打包成前端和 AI 看得懂的漂亮格式，假日也能完美相容！
    const formattedData = {
      price: currentPrice ? `$${currentPrice.toFixed(2)}` : "暫無數據",
      change: changePercent,
      high: data.h ? `$${data.h.toFixed(2)}` : (currentPrice ? `$${currentPrice.toFixed(2)}` : "暫無數據"),
      low: data.l ? `$${data.l.toFixed(2)}` : (currentPrice ? `$${currentPrice.toFixed(2)}` : "暫`無數據"),
      rawPrice: currentPrice, // 留給 AI 分析用的純數字
      rawChange: data.dp || 0
    };

    return Response.json(formattedData);
  } catch (error) {
    console.error("Fetch stock error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
