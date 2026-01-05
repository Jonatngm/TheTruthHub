import { Mail, MapPin, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Contact() {
  return (
    <div className="min-h-screen bg-[#EBE3DB]">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Contact
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-lg">
          Feel free to reach out with questions, reflections, or fellowship
        </p>

        <div className="grid gap-6 md:grid-cols-1 max-w-xl mx-auto">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <User className="w-6 h-6 text-primary" />
                Name
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">Emmanuel Victor Mucyo</p>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Mail className="w-6 h-6 text-primary" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="mailto:victor@truthhub.blog"
                className="text-primary hover:underline"
              >
                victor@truthhub.blog
              </a>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <MapPin className="w-6 h-6 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                101 Chesnut St, 6544 CPO<br />
                Berea, KY
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="spiritual-gradient p-8 rounded-lg inline-block">
            <p className="text-lg text-foreground/90 italic">
              "Having made known to us the mystery of His will, according to His good pleasure which He purposed in Himself, that in the dispensation of the fullness of the times He might gather together in one all things in Christ, both which are in heaven and which are on earth—in Him."
            </p>
            <p className="text-muted-foreground mt-3">- Ephesians 1:9-10 NKJV</p>
          </div>
        </div>
      </div>
    </div>
  );
}
