export default async function handler(req, res) {

  const symbol = req.query.symbol;

  const apiKey = process.env.FINNHUB_KEY;

  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  res.status(200).json({
    symbol: symbol,
    price: data.c,
    change: data.d,
    percent: data.dp
  });
}
