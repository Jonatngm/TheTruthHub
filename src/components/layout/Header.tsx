import { Link, useLocation } from 'react-router-dom';
import { Cross } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm" data-version="2026-01-14-v5">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-base sm:text-lg text-primary transition-all duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md px-1"
        >
          <Cross className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">The Truth Hub</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          
          <Link
            to="/"
            className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-all duration-200 rounded-md hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              isActive('/') 
                ? 'text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-primary after:rounded-full' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-all duration-200 rounded-md hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              isActive('/about') 
                ? 'text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-primary after:rounded-full' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-all duration-200 rounded-md hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
              isActive('/contact') 
                ? 'text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-primary after:rounded-full' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Contact
          </Link>
          
          {user && (
            <>
              <Link
                to="/admin"
                className={`relative px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-all duration-200 rounded-md hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  isActive('/admin') 
                    ? 'text-primary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-3/4 after:h-0.5 after:bg-primary after:rounded-full' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Admin
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-sm sm:text-base px-3 sm:px-4 hover:bg-primary/10 hover:text-primary transition-all duration-200 ml-1 sm:ml-2"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
