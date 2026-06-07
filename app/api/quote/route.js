export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");

  const apiKey = process.env.FINNHUB_KEY;

  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  return Response.json(data);
}
