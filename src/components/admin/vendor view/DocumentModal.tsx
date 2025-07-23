"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download, X } from "lucide-react"

interface DocumentModalProps {
  selectedDocument: { url: string; index: number } | null
  onClose: () => void
  onDownload: (url: string) => void
}

export function DocumentModal({ selectedDocument, onClose, onDownload }: DocumentModalProps) {
  return (
    <Dialog open={!!selectedDocument} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 bg-white rounded-xl overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
          <DialogTitle className="flex items-center justify-between text-xl font-bold text-slate-900">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-slate-900 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span>Document {selectedDocument ? selectedDocument.index + 1 : ""}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          {selectedDocument && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <img
                  src={selectedDocument.url || "/placeholder.svg"}
                  alt={`Document ${selectedDocument.index + 1}`}
                  className="w-full max-h-[65vh] object-contain rounded-lg shadow-sm"
                />
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => onDownload(selectedDocument.url)}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md px-6 py-2"
                >
                  <Download className="h-4 w-4" />
                  Download Document
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
