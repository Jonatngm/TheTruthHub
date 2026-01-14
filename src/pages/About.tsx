import { Book, Heart, Cross } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-[#EBE3DB]">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16 max-w-3xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 sm:mb-10 md:mb-12 text-center">
          About The Truth Hub
        </h1>

        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          <section>
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <Book className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                  Mission Statement
                </h2>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-3 sm:mb-4">
                  We seek to establish a foundation of reality that is in agreement with the ultimate truth of
                  God revealed to us through His Unconditional Love. A foundation that eliminates the
                  dualistic illusion of the sacred and secular from our world-views, but presents all things
                  reconciled "In Christ" and "As Christ."
                </p>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed italic">
                  "Now all things are of God, who has reconciled us to Himself through Jesus Christ, and has
                  given us the ministry of reconciliation, that is, that God was in Christ reconciling the world to
                  Himself, not imputing their trespasses to them, and has committed to us the word of
                  reconciliation." 2 Corinthians 5:18-19
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#DCCFC3] p-4 sm:p-6 md:p-8 rounded-lg border border-border/60">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary flex-shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                  About the Author
                </h2>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-3 sm:mb-4">
                  Emmanuel Victor Mucyo, is a student of Christ that has a singular desire, "To know the truth,
                  and make the truth known." Through a couple of years of study and prayer, he has been
                  inspired by the Holy-Spirit to create this hub, a hub of truth, that fellow brethren might benefit
                  from the knowledge of Christ given to him.
                </p>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed italic">
                  "The words you read here are beyond just written letters, they are spirit and substance.
                  Every teaching comes as a piece of meal, thoughtfully woven from the corridors of eternity to
                  bring enlightenment to any man that is willing to learn and accept change." - Emmanuel
                  Mucyo
                </p>
              </div>
            </div>
          </section>

          <section className="text-center py-6 sm:py-8">
            <blockquote className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-primary italic px-2">
              "To them God willed to make known what are the riches of the glory of this mystery among the Gentiles: which is Christ in you, the hope of glory."
            </blockquote>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">- Colossians 1:27 NKJV</p>
          </section>
        </div>
      </div>
    </div>
  );
}
