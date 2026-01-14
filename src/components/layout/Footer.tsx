import { Cross } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-[#EBE3DB] mt-auto">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col items-center gap-3 sm:gap-4 text-center">
          <div className="flex items-center gap-2 text-primary">
            <Cross className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-base sm:text-lg">The Truth Hub</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground italic max-w-md px-4">
            "I am the way, the truth, and the life" - John 14:6
          </p>
          <p className="text-xs text-muted-foreground">
            © {currentYear} Emmanuel Victor Mucyo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
