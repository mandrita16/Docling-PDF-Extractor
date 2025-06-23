"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Download,
  FileText,
  ImageIcon,
  Table,
  BarChart3,
  Globe,
  Type,
  Clock,
  Sparkles,
  Brain,
  Zap,
  Eye,
} from "lucide-react"

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

interface ExtractionResultsProps {
  result: ExtractionResult
  onDownload: (result: ExtractionResult, format: "json" | "txt") => void
}

export function ExtractionResults({ result, onDownload }: ExtractionResultsProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      <Card className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden group-hover:border-cyan-400/50 transition-all duration-300">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500"></div>

        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-sm"></div>
                <div className="relative p-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-white text-xl font-bold">{result.filename}</CardTitle>
                <CardDescription className="flex items-center gap-6 mt-2 text-slate-300">
                  <span className="flex items-center gap-2 font-mono">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    {result.metadata.pages} PAGES
                  </span>
                  <span className="flex items-center gap-2 font-mono">
                    <Clock className="h-3 w-3 text-purple-400" />
                    {result.processingTime}MS
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded border border-green-500/30">
                    EXTRACTED
                  </span>
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(result, "json")}
                className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-600 text-slate-300 hover:from-cyan-600 hover:to-purple-600 hover:text-white transition-all duration-300 font-mono"
              >
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(result, "txt")}
                className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-600 text-slate-300 hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 font-mono"
              >
                <Download className="h-4 w-4 mr-2" />
                REPORT
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50">
              {[
                { value: "overview", label: "NEURAL SCAN", icon: Eye },
                { value: "content", label: "TEXT DATA", icon: FileText },
                { value: "fonts", label: "TYPOGRAPHY", icon: Type },
                { value: "images", label: "VISUALS", icon: ImageIcon },
                { value: "tables", label: "STRUCTURES", icon: Table },
                { value: "languages", label: "LINGUISTICS", icon: Globe },
              ].map((tab, index) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-mono text-xs transition-all duration-300"
                >
                  <tab.icon className="h-3 w-3 mr-1" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/30 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-cyan-400 font-mono flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      METADATA ANALYSIS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-slate-300 font-mono text-sm">
                    {result.metadata.title && (
                      <div className="flex justify-between">
                        <span className="text-purple-400">TITLE:</span>
                        <span className="text-right">{result.metadata.title}</span>
                      </div>
                    )}
                    {result.metadata.author && (
                      <div className="flex justify-between">
                        <span className="text-purple-400">AUTHOR:</span>
                        <span className="text-right">{result.metadata.author}</span>
                      </div>
                    )}
                    {result.metadata.creator && (
                      <div className="flex justify-between">
                        <span className="text-purple-400">CREATOR:</span>
                        <span className="text-right">{result.metadata.creator}</span>
                      </div>
                    )}
                    {result.metadata.creationDate && (
                      <div className="flex justify-between">
                        <span className="text-purple-400">CREATED:</span>
                        <span className="text-right text-xs">{result.metadata.creationDate}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-slate-900/30 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-cyan-400 font-mono">
                      <BarChart3 className="h-4 w-4" />
                      NEURAL STATISTICS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-slate-300 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-indigo-400">WORDS:</span>
                      <span className="text-cyan-300">{result.statistics.totalWords.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-400">CHARACTERS:</span>
                      <span className="text-cyan-300">{result.statistics.totalCharacters.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-400">IMAGES:</span>
                      <span className="text-purple-300">{result.images.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-400">TABLES:</span>
                      <span className="text-orange-300">{result.tables.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content">
              <Card className="bg-slate-900/30 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sm text-cyan-400 font-mono">EXTRACTED TEXT DATA</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <pre className="text-sm whitespace-pre-wrap text-slate-300 font-mono leading-relaxed">
                      {result.content.fullText.substring(0, 2000)}
                      {result.content.fullText.length > 2000 && (
                        <span className="text-purple-400">
                          {"\n\n[TRUNCATED - Full content available in download]"}
                        </span>
                      )}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fonts">
              <div className="space-y-4">
                {Object.entries(result.fonts).map(([page, fonts]) => (
                  <Card key={page} className="bg-slate-900/30 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-cyan-400 font-mono">
                        <Type className="h-4 w-4" />
                        PAGE {page} TYPOGRAPHY
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {fonts.map((font, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-slate-800/50 border-green-500/30 text-green-300 font-mono px-3 py-1"
                          >
                            {font.fontName} ({font.fontSize}px)
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="images">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.images.map((image, index) => (
                  <Card
                    key={index}
                    className="bg-slate-900/30 border-slate-700/50 backdrop-blur-sm group hover:border-purple-500/50 transition-all duration-300"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-cyan-400 font-mono">
                        <ImageIcon className="h-4 w-4" />
                        {image.filename}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-slate-300 font-mono">
                        <div className="flex justify-between">
                          <span className="text-purple-400">PAGE:</span>
                          <span>{image.page}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-400">SIZE:</span>
                          <span>
                            {image.width} × {image.height}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-400">FORMAT:</span>
                          <span className="text-cyan-300">{image.format}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tables">
              <div className="space-y-4">
                {result.tables.map((table, index) => (
                  <Card key={index} className="bg-slate-900/30 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-cyan-400 font-mono">
                        <Table className="h-4 w-4" />
                        TABLE {index + 1} - PAGE {table.page}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-48">
                        <table className="w-full text-sm font-mono">
                          {table.headers && (
                            <thead>
                              <tr>
                                {table.headers.map((header, i) => (
                                  <th
                                    key={i}
                                    className="border border-slate-600 p-2 font-medium text-orange-400 bg-slate-800/50 text-left"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {table.data.slice(0, 10).map((row, i) => (
                              <tr key={i}>
                                {row.map((cell, j) => (
                                  <td key={j} className="border border-slate-600 p-2 text-slate-300">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {table.data.length > 10 && (
                          <p className="text-xs text-slate-400 mt-2 font-mono">[SHOWING 10/{table.data.length} ROWS]</p>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="languages">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.languages).map(([page, lang]) => (
                  <Card
                    key={page}
                    className="bg-slate-900/30 border-slate-700/50 backdrop-blur-sm group hover:border-red-500/50 transition-all duration-300"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-cyan-400 font-mono">
                        <Globe className="h-4 w-4" />
                        PAGE {page}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Badge
                          variant="secondary"
                          className="bg-red-500/20 text-red-300 border-red-500/30 font-mono px-3 py-1"
                        >
                          {lang.language.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-slate-400 font-mono">
                          CONFIDENCE: {(lang.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
