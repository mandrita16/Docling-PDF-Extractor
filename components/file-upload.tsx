"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Upload, File, Sparkles, Zap, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileUpload: (files: FileList) => void
  disabled?: boolean
}

export function FileUpload({ onFileUpload, disabled }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const fileList = new DataTransfer()
        acceptedFiles.forEach((file) => fileList.items.add(file))
        onFileUpload(fileList.files)
      }
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
    disabled,
  })

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 group overflow-hidden",
          isDragActive
            ? "border-cyan-400 bg-cyan-500/10 scale-105 shadow-2xl shadow-cyan-500/25"
            : "border-slate-600/50 hover:border-purple-500/50 hover:bg-slate-800/30",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <input {...getInputProps()} />

        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        <div className="relative flex flex-col items-center">
          <div
            className={cn(
              "relative p-6 rounded-full mb-6 transition-all duration-500",
              isDragActive
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 shadow-2xl shadow-cyan-500/50"
                : "bg-gradient-to-r from-slate-800 to-slate-900 group-hover:from-purple-600 group-hover:to-pink-600",
            )}
          >
            {/* Orbital Rings */}
            <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow"></div>
            <div className="absolute inset-2 rounded-full border border-white/10 animate-spin-reverse"></div>

            {disabled ? (
              <Brain className="h-12 w-12 text-cyan-400 animate-pulse" />
            ) : isDragActive ? (
              <Sparkles className="h-12 w-12 text-white animate-bounce" />
            ) : (
              <Upload className="h-12 w-12 text-slate-400 group-hover:text-white transition-colors duration-300" />
            )}
          </div>

          {disabled ? (
            <div className="space-y-2">
              <p className="text-xl text-cyan-300 font-bold">AI PROCESSING</p>
              <p className="text-sm text-slate-400 font-mono">[NEURAL_CORE] Analyzing document structure...</p>
            </div>
          ) : isDragActive ? (
            <div className="space-y-2">
              <p className="text-xl text-cyan-300 font-bold animate-pulse">DEPLOY DOCUMENTS</p>
              <p className="text-sm text-slate-300">Release files for neural analysis</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xl mb-2 text-white font-bold">NEURAL UPLOAD ZONE</p>
                <p className="text-sm text-slate-400 mb-6 font-mono">Deploy PDF documents for AI extraction</p>
              </div>
              <Button
                variant="outline"
                disabled={disabled}
                className="relative bg-gradient-to-r from-cyan-600 to-purple-600 border-0 text-white hover:from-cyan-500 hover:to-purple-500 px-8 py-3 font-bold tracking-wider overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                <Zap className="h-4 w-4 mr-2" />
                INITIALIZE UPLOAD
              </Button>
            </div>
          )}
        </div>
      </div>

      {acceptedFiles.length > 0 && !disabled && (
        <div className="space-y-4">
          <h4 className="font-bold text-cyan-400 text-lg flex items-center gap-2">
            <File className="h-5 w-5" />
            QUEUED FOR ANALYSIS
          </h4>
          <div className="space-y-3">
            {acceptedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300 group"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg group-hover:from-purple-400/30 group-hover:to-pink-400/30 transition-all duration-300">
                  <File className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <span className="text-slate-300 font-medium">{file.name}</span>
                  <div className="text-xs text-slate-500 font-mono mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded border border-green-500/30">
                  READY
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
