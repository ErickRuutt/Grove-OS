import { NextRequest, NextResponse } from "next/server";
import { generateExportZip } from "../../../../lib/export-generator";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId || typeof sessionId !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(sessionId)) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const result = await generateExportZip(sessionId);
    const fileBuffer = await fs.readFile(result.filePath);

    // Clean up after reading
    fs.unlink(result.filePath).catch(() => {});

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "Content-Length": String(fileBuffer.length),
      },
    });
  } catch (error) {
    console.error("Export error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
