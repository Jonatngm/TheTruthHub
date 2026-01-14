import { Mail, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Contact() {
  return (
    <div className="min-h-screen bg-[#EBE3DB]">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 text-center">
          Contact
        </h1>
        <p className="text-center text-muted-foreground mb-8 sm:mb-10 md:mb-12 text-base sm:text-lg px-2">
          Feel free to reach out with questions, reflections, or fellowship
        </p>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-1 max-w-xl mx-auto">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Name
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-foreground">Emmanuel Victor Mucyo</p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:victor@truthhub.blog"
                className="text-sm sm:text-base text-primary hover:underline break-all"
              >
                victor@truthhub.blog
              </a>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm sm:text-base text-foreground">
                101 Chesnut St, 6544 CPO<br />
                Berea, KY
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 sm:mt-14 md:mt-16 text-center px-2">
          <div className="spiritual-gradient p-4 sm:p-6 md:p-8 rounded-lg inline-block max-w-full">
            <p className="text-sm sm:text-base md:text-lg text-foreground/90 italic">
              "Having made known to us the mystery of His will, according to His good pleasure which He purposed in Himself, that in the dispensation of the fullness of the times He might gather together in one all things in Christ, both which are in heaven and which are on earth—in Him."
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">- Ephesians 1:9-10 NKJV</p>
          </div>
        </div>
      </div>
    </div>
  );
}
