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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" data-version="2026-01-14-v4">
      <nav className="container mx-auto px-3 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 sm:gap-2 font-semibold text-base sm:text-lg text-primary">
          <Cross className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">The Truth Hub</span>
          <span className="xs:hidden">TTH</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          
          <Link
            to="/"
            className={`text-xs sm:text-sm font-medium transition-colors hover:text-primary ${
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`text-xs sm:text-sm font-medium transition-colors hover:text-primary ${
              isActive('/about') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`text-xs sm:text-sm font-medium transition-colors hover:text-primary ${
              isActive('/contact') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Contact
          </Link>
          
          {user && (
            <>
              <Link
                to="/admin"
                className={`text-xs sm:text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/admin') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Admin
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-xs sm:text-sm px-2 sm:px-3"
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
