"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, ImageIcon, Table, BarChart3, Globe, Type, Zap, Brain, Eye, Cpu } from "lucide-react"
import { ExtractionResults } from "@/components/extraction-results"
import { FileUpload } from "@/components/file-upload"

interface ExtractionResult {
  filename: string
  metadata: {
    title?: string
    author?: string
    subject?: string
    creator?: string
    producer?: string
    creationDate?: string
    modificationDate?: string
    pages: number
  }
  content: {
    fullText: string
    pageTexts: string[]
    structure: any[]
  }
  fonts: {
    [page: number]: {
      fontName: string
      fontSize: number
      usage: number
    }[]
  }
  images: {
    page: number
    filename: string
    width: number
    height: number
    format: string
  }[]
  tables: {
    page: number
    data: string[][]
    headers?: string[]
  }[]
  languages: {
    [page: number]: {
      language: string
      confidence: number
    }
  }
  statistics: {
    totalWords: number
    totalCharacters: number
    pageStats: {
      page: number
      words: number
      characters: number
    }[]
  }
  processingTime: number
}

export default function PDFExtractorPage() {
  const [results, setResults] = useState<ExtractionResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleFileUpload = async (files: FileList) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)

    try {
      const newResults: ExtractionResult[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress((i / files.length) * 100)

        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/extract-pdf", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          let errorMessage = `Failed to process ${file.name}`

          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorData.details || errorMessage
          } catch {
            const errorText = await response.text()
            errorMessage = errorText.includes("Error") ? `Server error processing ${file.name}` : errorMessage
          }

          throw new Error(errorMessage)
        }

        let result
        try {
          result = await response.json()
        } catch (jsonError) {
          throw new Error(`Invalid response format for ${file.name}`)
        }

        newResults.push(result)
      }

      setResults((prev) => [...prev, ...newResults])
      setProgress(100)
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while processing the files")
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadResults = async (result: ExtractionResult, format: "json" | "txt") => {
    try {
      const response = await fetch("/api/download-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ result, format }),
      })

      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${result.filename}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError("Failed to download results")
    }
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black overflow-x-hidden relative"
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 25%, #16213e 50%, #0f3460 75%, #0a0a0a 100%)
        `,
      }}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-50"></div>
      </div>

      {/* Parallax Layers */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, rgba(147, 51, 234, 0.1) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(59, 130, 246, 0.1) 50%, transparent 60%)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto py-16 px-4 max-w-7xl">
          <div
            className="text-center mb-16 transform transition-all duration-1000"
            style={{
              transform: `translateY(${scrollY * -0.2}px) rotateX(${scrollY * 0.01}deg)`,
            }}
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative p-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full">
                <Brain className="h-16 w-16 text-white animate-spin-slow" />
              </div>
            </div>

            <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              DOCLING AI
            </h1>
            <div className="text-2xl font-bold text-white mb-4 tracking-wider">
              <span className="text-cyan-400">NEURAL</span> PDF <span className="text-purple-400">EXTRACTION</span>
            </div>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Advanced AI-powered document analysis with real-time content extraction, intelligent parsing, and
              multi-dimensional data visualization
            </p>
          </div>

          {/* Floating Capability Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {[
              { icon: FileText, label: "Text Extraction", color: "cyan", delay: 0 },
              { icon: Type, label: "Font Analysis", color: "green", delay: 100 },
              { icon: ImageIcon, label: "Image Detection", color: "purple", delay: 200 },
              { icon: Table, label: "Table Parsing", color: "orange", delay: 300 },
              { icon: Globe, label: "Language AI", color: "red", delay: 400 },
              { icon: BarChart3, label: "Data Analytics", color: "indigo", delay: 500 },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative transform transition-all duration-700 hover:scale-110 hover:-translate-y-4"
                style={{
                  animationDelay: `${item.delay}ms`,
                  transform: `
                    translateY(${Math.sin(scrollY * 0.01 + index) * 10}px) 
                    rotateY(${mousePosition.x * 0.01}deg)
                  `,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300">
                  <div
                    className={`p-3 bg-gradient-to-r from-${item.color}-500/20 to-${item.color}-600/20 rounded-lg mb-3 group-hover:from-${item.color}-400/30 group-hover:to-${item.color}-500/30 transition-all duration-300`}
                  >
                    <item.icon className={`h-6 w-6 text-${item.color}-400 group-hover:text-${item.color}-300`} />
                  </div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1 space-y-8">
              <div
                className="relative group transform transition-all duration-700"
                style={{
                  transform: `translateX(${scrollY * -0.1}px) rotateY(${mousePosition.x * 0.005}deg)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden group-hover:border-cyan-400/50 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-3 text-white text-xl">
                      <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      NEURAL UPLOAD
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                      Deploy PDF documents for AI-powered extraction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUpload onFileUpload={handleFileUpload} disabled={isProcessing} />

                    {isProcessing && (
                      <div className="mt-6 space-y-4">
                        <div className="flex justify-between text-sm text-cyan-300 font-mono">
                          <span className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 animate-spin" />
                            PROCESSING...
                          </span>
                          <span className="text-purple-400">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="bg-slate-800 h-2" />
                        <div className="text-xs text-slate-400 font-mono">
                          [AI_CORE] Analyzing document structure...
                        </div>
                      </div>
                    )}

                    {error && (
                      <Alert className="mt-6 bg-red-900/20 border-red-500/50 backdrop-blur-sm" variant="destructive">
                        <Zap className="h-4 w-4" />
                        <AlertDescription className="text-red-300 font-mono">[ERROR] {error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* AI Capabilities Panel */}
              <div
                className="relative group transform transition-all duration-700"
                style={{
                  transform: `translateX(${scrollY * -0.05}px) rotateY(${mousePosition.x * 0.003}deg)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl overflow-hidden group-hover:border-purple-400/50 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Eye className="h-5 w-5 text-purple-400" />
                      AI CAPABILITIES
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: FileText, label: "Neural Text Parsing", status: "ACTIVE", color: "cyan" },
                      { icon: Type, label: "Font Recognition AI", status: "ACTIVE", color: "green" },
                      { icon: ImageIcon, label: "Visual Element Detection", status: "ACTIVE", color: "purple" },
                      { icon: Table, label: "Structure Analysis", status: "ACTIVE", color: "orange" },
                      { icon: Globe, label: "Language Processing", status: "ACTIVE", color: "red" },
                      { icon: BarChart3, label: "Statistical Analysis", status: "ACTIVE", color: "indigo" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group/item"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div
                          className={`p-2 bg-gradient-to-r from-${item.color}-500/20 to-${item.color}-600/20 rounded-lg group-hover/item:from-${item.color}-400/30 group-hover/item:to-${item.color}-500/30 transition-all duration-300`}
                        >
                          <item.icon className={`h-4 w-4 text-${item.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <span className="text-slate-300 text-sm font-medium">{item.label}</span>
                        </div>
                        <div
                          className={`px-2 py-1 bg-${item.color}-500/20 text-${item.color}-400 text-xs font-mono rounded border border-${item.color}-500/30`}
                        >
                          {item.status}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2">
              <div
                className="transform transition-all duration-700"
                style={{
                  transform: `translateX(${scrollY * 0.05}px) rotateY(${mousePosition.x * -0.003}deg)`,
                }}
              >
                {results.length > 0 ? (
                  <div className="space-y-8">
                    {results.map((result, index) => (
                      <div
                        key={index}
                        className="transform transition-all duration-700"
                        style={{
                          animationDelay: `${index * 200}ms`,
                          transform: `translateY(${Math.sin(scrollY * 0.01 + index * 0.5) * 5}px)`,
                        }}
                      >
                        <ExtractionResults result={result} onDownload={downloadResults} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 via-purple-800/20 to-slate-800/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <Card className="relative bg-black/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl h-96 flex items-center justify-center group-hover:border-slate-600/50 transition-all duration-300">
                      <CardContent className="text-center">
                        <div className="relative mb-6">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                          <div className="relative p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-full border border-slate-600/30">
                            <FileText className="h-16 w-16 text-purple-400 animate-float" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 text-white">NEURAL CORE READY</h3>
                        <p className="text-slate-400 font-mono">Awaiting PDF deployment for AI analysis...</p>
                        <div className="mt-4 flex justify-center">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                            <div
                              className="w-2 h-2 bg-purple-400 rounded-full animate-ping"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-pink-400 rounded-full animate-ping"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
