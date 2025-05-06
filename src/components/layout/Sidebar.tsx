
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Clock,
  FileText,
  Folder,
  FolderOpen,
  Heart,
  Library,
  ListFilter,
  PlusCircle,
  Share2,
  Tags,
  Trash2,
} from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-border/40 bg-sidebar transition-all duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0"
      )}
    >
      <div className="flex items-center h-14 px-4 border-b border-border/40 gap-2">
        <div className="flex items-center justify-center h-8 w-8 rounded-md bg-primary text-primary-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <span className="font-display font-semibold text-lg leading-none mt-1 text-foreground">
          PaperOrbit
        </span>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-2 font-medium">
              <FileText className="h-4 w-4" />
              All Papers
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 font-medium">
              <Clock className="h-4 w-4" />
              Recent
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 font-medium">
              <Heart className="h-4 w-4" />
              Favorites
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 font-medium">
              <BookOpen className="h-4 w-4" />
              To Read
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Collections
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add collection</span>
              </Button>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Folder className="h-4 w-4 text-orbit-400" />
              Machine Learning
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <FolderOpen className="h-4 w-4 text-orbit-400" />
              Quantum Computing
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Folder className="h-4 w-4 text-orbit-400" />
              Neural Networks
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Folder className="h-4 w-4 text-orbit-400" />
              Computer Vision
            </Button>
            <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground text-sm">
              <span>Show all collections</span>
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tags
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add tag</span>
              </Button>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Research</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Review</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Important</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span>Reference</span>
            </Button>
            <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-foreground text-sm">
              <span>Show all tags</span>
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Tags className="h-4 w-4" />
            Manage Tags
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Library className="h-4 w-4" />
            Library Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Share2 className="h-4 w-4" />
            Shared with Me
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Trash2 className="h-4 w-4" />
            Trash
          </Button>
        </div>
      </ScrollArea>

      <div className="border-t border-border/40 p-4">
        <Button className="w-full gap-2">
          <PlusCircle className="h-4 w-4" />
          Upload Papers
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
