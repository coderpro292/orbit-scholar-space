
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface PDFViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle?: string;
  documentUrl?: string;
}

const PDFViewer = ({
  open,
  onOpenChange,
  documentTitle = 'Document Preview',
  documentUrl,
}: PDFViewerProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handlePageChange = (increment: number) => {
    setCurrentPage((prev) => {
      const newPage = prev + increment;
      return Math.max(1, Math.min(newPage, totalPages || 1));
    });
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Placeholder for PDF.js integration
  useEffect(() => {
    if (open && documentUrl) {
      // Simulate loading a PDF document
      console.log("Loading PDF:", documentUrl);
      
      // Simulate getting total pages
      const simulatedTotalPages = Math.floor(Math.random() * 20) + 5;
      setTotalPages(simulatedTotalPages);
      setCurrentPage(1);
    }
  }, [open, documentUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "sm:max-w-[900px] p-0 gap-0",
          isFullScreen && "w-screen h-screen max-w-none sm:max-w-none rounded-none"
        )}
      >
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg truncate pr-4">{documentTitle}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleFullScreen}
                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                aria-label="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleZoomOut()}
                disabled={zoomLevel <= 50}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{zoomLevel}%</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleZoomIn()}
                disabled={zoomLevel >= 200}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(-1)}
                disabled={currentPage <= 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm flex items-center">
                <span className="font-medium">{currentPage}</span>
                <span className="mx-1">/</span>
                <span>{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(1)}
                disabled={currentPage >= totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div 
          className={cn(
            "flex items-center justify-center bg-muted/30 p-4",
            isFullScreen ? "flex-1 overflow-auto" : "h-[600px] overflow-auto"
          )}
        >
          {documentUrl ? (
            <div 
              className="rounded-lg shadow-lg bg-white overflow-hidden pdf-page-shadow"
              style={{ 
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'center top',
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              {/* PDF.js would render the actual PDF here */}
              <div className="relative" style={{ width: '595px', height: '842px' }}>
                {/* Simulated PDF content for demo */}
                <div className="absolute inset-0 border border-border flex flex-col">
                  <div className="p-8 flex-1 flex flex-col">
                    <h1 className="text-2xl font-bold mb-4">Sample Academic Paper</h1>
                    <p className="text-sm mb-4">Authors: John Doe, Jane Smith, Robert Johnson</p>
                    <p className="text-sm mb-8">Published: June 2023</p>
                    
                    <h2 className="text-xl font-semibold mb-2">Abstract</h2>
                    <p className="text-sm mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    
                    <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
                    <p className="text-sm mb-2">
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
                      nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                      deserunt mollit anim id est laborum.
                    </p>
                    <p className="text-sm mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
                      ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                      laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    
                    <div className="mt-auto text-sm text-center text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No document selected or preview not available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
