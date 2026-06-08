// 這個檔案已經廢棄，強制動態不讓 Vercel 報錯
export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json({ message: "請使用 /api/stockai" });
}
