import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    let requestData

    try {
      requestData = await request.json()
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    const { result, format } = requestData

    if (!result || !format) {
      return NextResponse.json({ error: "Missing result or format parameter" }, { status: 400 })
    }

    let content: string
    let mimeType: string
    let filename: string

    if (format === "json") {
      content = JSON.stringify(result, null, 2)
      mimeType = "application/json"
      filename = `${result.filename || "document"}.json`
    } else if (format === "txt") {
      content = generateTextReport(result)
      mimeType = "text/plain"
      filename = `${result.filename || "document"}.txt`
    } else {
      return NextResponse.json({ error: "Invalid format. Use 'json' or 'txt'" }, { status: 400 })
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": content.length.toString(),
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate download",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateTextReport(result: any): string {
  try {
    const lines = [
      `╔══════════════════════════════════════════════════════════════╗`,
      `║                    PDF EXTRACTION REPORT                     ║`,
      `╚══════════════════════════════════════════════════════════════╝`,
      ``,
      `📄 Filename: ${result.filename || "Unknown"}`,
      `⏱️  Processing Time: ${result.processingTime || 0}ms`,
      `📖 Pages: ${result.metadata?.pages || 0}`,
      ``,
      `┌─ METADATA ─────────────────────────────────────────────────┐`,
    ]

    if (result.metadata?.title) lines.push(`│ Title: ${result.metadata.title}`)
    if (result.metadata?.author) lines.push(`│ Author: ${result.metadata.author}`)
    if (result.metadata?.creator) lines.push(`│ Creator: ${result.metadata.creator}`)
    if (result.metadata?.creationDate) lines.push(`│ Created: ${result.metadata.creationDate}`)

    lines.push(
      `└────────────────────────────────────────────────────────────┘`,
      ``,
      `┌─ STATISTICS ───────────────────────────────────────────────┐`,
      `│ 📊 Total Words: ${result.statistics?.totalWords?.toLocaleString() || 0}`,
      `│ 🔤 Total Characters: ${result.statistics?.totalCharacters?.toLocaleString() || 0}`,
      `│ 🖼️  Images Found: ${result.images?.length || 0}`,
      `│ 📋 Tables Found: ${result.tables?.length || 0}`,
      `└────────────────────────────────────────────────────────────┘`,
      ``,
      `┌─ LANGUAGES DETECTED ───────────────────────────────────────┐`,
    )

    if (result.languages) {
      Object.entries(result.languages).forEach(([page, lang]: [string, any]) => {
        lines.push(
          `│ Page ${page}: ${lang.language?.toUpperCase() || "UNKNOWN"} (${((lang.confidence || 0) * 100).toFixed(1)}%)`,
        )
      })
    }

    lines.push(
      `└───��────────────────────────────────────────────────────────┘`,
      ``,
      `┌─ EXTRACTED CONTENT ────────────────────────────────────────┐`,
      ``,
      result.content?.fullText || "No content extracted",
      ``,
      `└────────────────────────────────────────────────────────────┘`,
    )

    return lines.join("\n")
  } catch (error) {
    console.error("Error generating text report:", error)
    return `Error generating report: ${error instanceof Error ? error.message : "Unknown error"}`
  }
}
