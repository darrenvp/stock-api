export const metadata = {
  title: 'Stock API',
  description: 'My Stock API Project',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
