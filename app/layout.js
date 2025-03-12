import "./globals.css";

export const metadata = {
  title: "ttf to woff and woff2",
  description: "Convertion from ttf to woff and woff2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.ico" sizes="any" />

      <meta property="og:title" content="ttf to woff and woff2" />
      <meta
        property="og:description"
        content="Convertion from ttf to woff and woff2"
      />
      <meta property="og:image" content="https://woff-converter.vercel.app/webog.webp" />
      <meta property="og:type" content="website" />
      <body>{children}</body>
    </html>
  );
}
