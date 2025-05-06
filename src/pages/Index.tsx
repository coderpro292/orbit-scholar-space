
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import DocumentCard from '@/components/ui/DocumentCard';
import FileUploader from '@/components/ui/FileUploader';
import PDFViewer from '@/components/PDFViewer';
import AuthForms from '@/components/authentication/AuthForms';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ListFilter, Grid3X3, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Document } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Sample data for documents (will be replaced with real data)
const sampleDocuments = [
  {
    id: '1',
    title: 'Deep Learning Approaches for Natural Language Processing',
    authors: ['Alex Johnson', 'Sarah Miller'],
    date: 'June 2023',
    tags: ['NLP', 'Deep Learning']
  },
  {
    id: '2',
    title: 'Quantum Computing: Current State and Future Directions',
    authors: ['Robert Chen', 'Maria Garcia', 'David Lee'],
    date: 'March 2023',
    tags: ['Quantum Computing', 'Research'],
    favorite: true
  },
  {
    id: '3',
    title: 'A Comparative Study of Machine Learning Algorithms for Image Classification',
    authors: ['Emily Wilson'],
    date: 'January 2023',
    tags: ['Image Classification', 'Machine Learning']
  },
  {
    id: '4',
    title: 'Advancements in Computer Vision: A Comprehensive Review',
    authors: ['Michael Brown', 'Lisa Zhang'],
    date: 'November 2022',
    tags: ['Computer Vision', 'Review']
  },
  {
    id: '5',
    title: 'Neural Networks for Time Series Forecasting',
    authors: ['Daniel White'],
    date: 'October 2022',
    tags: ['Neural Networks', 'Time Series']
  },
  {
    id: '6',
    title: 'Explainable AI: Techniques and Applications',
    authors: ['Jennifer Adams', 'Kevin Park'],
    date: 'September 2022',
    tags: ['XAI', 'AI Ethics']
  },
  {
    id: '7',
    title: 'Recent Advances in Reinforcement Learning',
    authors: ['Thomas Moore', 'Sophia Chen'],
    date: 'July 2022',
    tags: ['Reinforcement Learning']
  },
  {
    id: '8',
    title: 'Edge Computing for IoT Applications',
    authors: ['James Wilson'],
    date: 'May 2022',
    tags: ['Edge Computing', 'IoT']
  }
];

// Main Index component
const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['documents', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user,
  });
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDocumentClick = async (document: Document) => {
    setSelectedDocument(document);
    
    // Get signed URL for the PDF file
    if (document.file_path) {
      try {
        const { data, error } = await supabase.storage
          .from('papers')
          .createSignedUrl(document.file_path, 60); // URL valid for 60 seconds
        
        if (error) {
          throw error;
        }
        
        setPdfUrl(data.signedUrl);
        setIsPDFViewerOpen(true);
      } catch (error) {
        console.error("Error getting signed URL:", error);
        toast({
          title: "Error",
          description: "Could not load the PDF file",
          variant: "destructive",
        });
      }
    } else {
      // Fallback to sample PDF if no file path
      setPdfUrl('/sample.pdf');
      setIsPDFViewerOpen(true);
    }
  };

  const openAuthDialog = () => {
    setShowAuthDialog(true);
  };

  const openUploadDialog = () => {
    if (!user) {
      openAuthDialog();
      return;
    }
    setShowUploadDialog(true);
  };

  const handleFileUploaded = async (filePath: string, fileData: {
    title: string;
    size: number;
    type: string;
    originalName: string;
  }) => {
    if (!user) return;
    
    try {
      // Save document metadata to the database
      const { error } = await supabase
        .from('documents')
        .insert({
          title: fileData.title,
          file_path: filePath,
          user_id: user.id,
          authors: [],  // Can be updated later
          date: new Date().toISOString(),
          tags: [],     // Can be updated later
          favorite: false,
        });
      
      if (error) {
        throw error;
      }
      
      // Refresh the documents list
      refetch();
    } catch (error) {
      console.error("Error saving document metadata:", error);
      toast({
        title: "Error",
        description: "Failed to save document information",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} />

        {/* Main content */}
        <main className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarOpen ? "md:ml-72" : "ml-0"
        )}>
          <div className="flex-1 overflow-auto">
            {/* Content header */}
            <div className="container max-w-full px-4 py-6 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight mb-1">Academic Papers</h1>
                  <p className="text-muted-foreground">
                    Manage and organize your research documents in one place
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={openUploadDialog}
                    className="gap-2"
                  >
                    Upload Paper
                  </Button>
                  
                  {!user && !authLoading && (
                    <Button 
                      variant="outline" 
                      onClick={openAuthDialog}
                      className="gap-2"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6 mb-4">
                <Tabs defaultValue="all" className="w-fit">
                  <TabsList>
                    <TabsTrigger value="all">All Papers</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  </TabsList>
                
                  <TabsContent value="all" className="mt-0">
                    <div className={cn(
                      viewMode === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
                        : "space-y-4"
                    )}>
                      {isLoading ? (
                        <div className="col-span-full flex justify-center py-12">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
                        </div>
                      ) : documents && documents.length > 0 ? (
                        documents.map((doc) => (
                          <DocumentCard
                            key={doc.id}
                            id={doc.id}
                            title={doc.title}
                            authors={doc.authors}
                            date={doc.date}
                            favorite={doc.favorite}
                            tags={doc.tags}
                            onClick={() => handleDocumentClick(doc)}
                            className={viewMode === 'list' ? "sm:flex sm:items-center sm:gap-4" : ""}
                          />
                        ))
                      ) : user ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                          <p className="mb-4">No documents found. Upload your first paper!</p>
                          <Button onClick={openUploadDialog}>Upload Paper</Button>
                        </div>
                      ) : (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                          <p className="mb-4">Sign in to view your papers</p>
                          <Button onClick={openAuthDialog}>Sign In</Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recent" className="mt-0">
                    <div className="text-center py-8 text-muted-foreground">
                      {user ? (
                        <p>Your recently added papers will appear here.</p>
                      ) : (
                        <div>
                          <p className="mb-4">Sign in to view your recent papers</p>
                          <Button onClick={openAuthDialog}>Sign In</Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="favorites" className="mt-0">
                    <div className="text-center py-8 text-muted-foreground">
                      {user ? (
                        <p>Your favorite papers will appear here.</p>
                      ) : (
                        <div>
                          <p className="mb-4">Sign in to view your favorite papers</p>
                          <Button onClick={openAuthDialog}>Sign In</Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <ListFilter className="h-4 w-4" />
                    <span className="hidden sm:inline-block">Filter</span>
                  </Button>
                  
                  <div className="flex items-center rounded-md border shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-none rounded-l-md",
                        viewMode === 'grid' && "bg-muted"
                      )}
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-none rounded-r-md",
                        viewMode === 'list' && "bg-muted"
                      )}
                      onClick={() => setViewMode('list')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                      <span className="sr-only">List view</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* PDF Viewer Dialog */}
      <PDFViewer
        open={isPDFViewerOpen}
        onOpenChange={setIsPDFViewerOpen}
        documentTitle={selectedDocument?.title}
        documentUrl={pdfUrl || '/sample.pdf'}
      />
      
      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md p-0">
          <AuthForms onSuccess={() => setShowAuthDialog(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Papers</DialogTitle>
          </DialogHeader>
          <FileUploader onFileUploaded={handleFileUploaded} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
