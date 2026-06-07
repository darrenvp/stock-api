"use client";

import { useEffect, useState } from "react";

const stocks = ["NVDA", "AMD", "TSLA", "PLTR"];

export default function Home() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const results = await Promise.all(
      stocks.map(async (symbol) => {
        const res = await fetch(`/api/quote?symbol=${symbol}`);
        const json = await res.json();
        return { symbol, json };
      })
    );

    const map = {};
    results.forEach((r) => {
      map[r.symbol] = r.json;
    });

    setData(map);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Stock Dashboard</h1>

      <button onClick={fetchData}>Refresh</button>

      {loading && <p>Loading...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {stocks.map((symbol) => {
          const s = data[symbol];
          if (!s) return null;

          return (
            <div key={symbol} style={{ border: "1px solid #ddd", padding: 10 }}>
              <h2>{symbol}</h2>
              <p>Price: {s.c}</p>
              <p>Change: {s.dp}%</p>
              <p>High: {s.h}</p>
              <p>Low: {s.l}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
