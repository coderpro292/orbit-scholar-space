
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, Plus, Bell, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ toggleSidebar, isSidebarOpen }: NavbarProps) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-full items-center">
        <div className="flex items-center gap-2 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="md:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className={cn("hidden gap-1 transition-opacity md:flex", isSidebarOpen ? "opacity-0" : "opacity-100")}>
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
            <span className="font-display font-semibold text-lg leading-none ml-1 mt-1.5 text-foreground">
              PaperOrbit
            </span>
          </div>
        </div>

        <div className={cn(
          "ml-auto flex items-center gap-2", 
          searchFocused ? "w-full md:w-1/2 lg:w-1/3" : "w-auto"
        )}>
          <div className={cn(
            "relative flex items-center w-full transition-all duration-300",
            searchFocused ? "flex-1" : "md:w-64 w-auto"
          )}>
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search papers..." 
              className={cn(
                "pl-8 pr-4 bg-muted/50 border-none focus:bg-background focus-visible:ring-1",
                !searchFocused && "md:w-full w-0 px-0 md:px-8 opacity-0 md:opacity-100"
              )}
              onFocus={() => setSearchFocused(true)} 
              onBlur={() => setSearchFocused(false)}
            />
            {!searchFocused && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={() => setSearchFocused(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>

          <Button 
            size="icon" 
            variant="ghost" 
            className={cn("text-muted-foreground hover:text-foreground transition-opacity", 
              searchFocused ? "opacity-0 md:opacity-100" : "opacity-100"
            )}
            aria-label="Create new document"
          >
            <Plus className="h-5 w-5" />
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className={cn("text-muted-foreground hover:text-foreground transition-opacity", 
              searchFocused ? "opacity-0 md:opacity-100" : "opacity-100"
            )}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className={cn("text-muted-foreground hover:text-foreground rounded-full transition-opacity", 
                  searchFocused ? "opacity-0 md:opacity-100" : "opacity-100"
                )}
                aria-label="User menu"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
