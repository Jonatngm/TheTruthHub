import { Cross } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-[#EBE3DB] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-primary">
            <Cross className="w-5 h-5" />
            <span className="font-semibold text-lg">The Truth Hub</span>
          </div>
          <p className="text-sm text-muted-foreground italic max-w-md">
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
