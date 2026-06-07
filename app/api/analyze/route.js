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

    // 💡 保持純數字回傳，完全不加 $ 或 %，讓前端愛怎麼解析就怎麼解析！
    const currentPrice = data.c || data.pc || 0;

    const formattedData = {
      price: currentPrice,
      change: data.d || 0,
      high: data.h || currentPrice,
      low: data.l || currentPrice
    };

    return Response.json(formattedData);
  } catch (error) {
    console.error("Fetch stock error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
