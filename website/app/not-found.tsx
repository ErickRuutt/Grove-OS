import Link from "next/link";

export default function NotFound() {
  return (
    <html>
      <body style={{ background: "#F7F6F3", color: "#0F0F0E", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "13px", fontFamily: "monospace", color: "#2D6A4F", fontWeight: 600, marginBottom: "16px" }}>404</p>
          <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "16px" }}>Page not found</h1>
          <Link href="/" style={{ color: "#2D6A4F", fontSize: "14px", fontWeight: 600 }}>
            Back to Grove →
          </Link>
        </div>
      </body>
    </html>
  );
}
