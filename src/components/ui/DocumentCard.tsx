
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen, 
  Download, 
  Heart, 
  MoreVertical, 
  Share, 
  Tag, 
  Trash2 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  id: string;
  title: string;
  authors: string[];
  date: string;
  thumbnail?: string;
  favorite?: boolean;
  tags?: string[];
  onClick?: () => void;
  className?: string;
}

const DocumentCard = ({
  id,
  title,
  authors,
  date,
  thumbnail,
  favorite = false,
  tags = [],
  onClick,
  className,
}: DocumentCardProps) => {
  const authorText = authors.length > 2 
    ? `${authors[0]} et al.` 
    : authors.join(', ');

  return (
    <div 
      className={cn(
        "paper-card group cursor-pointer animate-fade-in", 
        className
      )}
      onClick={onClick}
    >
      <div className="relative p-4 pb-0">
        <div className="document-thumbnail pdf-page-shadow bg-muted/30">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center text-muted-foreground/50 p-4 text-center">
              <FileIcon />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Open</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="mr-2 h-4 w-4" />
                <span>Add tag</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-5 left-5 h-8 w-8 bg-background/80 backdrop-blur-sm",
            favorite ? "text-red-500" : "text-muted-foreground opacity-0 group-hover:opacity-100"
          )}
          onClick={(e) => {
            e.stopPropagation();
            // Toggle favorite
          }}
        >
          <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
          <span className="sr-only">{favorite ? 'Remove from favorites' : 'Add to favorites'}</span>
        </Button>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-medium leading-tight text-base mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{authorText}</p>
        <p className="text-xs text-muted-foreground/80 mt-1">{date}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 2).map((tag) => (
              <span 
                key={tag}
                className="inline-block text-xs py-0.5 px-1.5 bg-orbit-100/50 text-orbit-800 dark:bg-orbit-900/20 dark:text-orbit-300 rounded-md"
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="inline-block text-xs py-0.5 px-1.5 bg-secondary text-secondary-foreground rounded-md">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FileIcon = () => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="40" 
      height="40" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 18h6" />
      <path d="M9 14h6" />
    </svg>
  );
};

export default DocumentCard;
