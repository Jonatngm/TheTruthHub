export function Hero() {
  return (
    <div className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-screen overflow-hidden">
      {/* Enhanced Background gradient with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B7355] via-[#6B563F] to-background opacity-90 animate-in fade-in duration-1000" />
      
      {/* Subtle pattern overlay for depth */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20 h-full flex flex-col items-center justify-center">
        <div className="max-w-8xl w-full flex flex-col items-center space-y-6 sm:space-y-8 md:space-y-10 animate-in slide-in-from-bottom-4 duration-700">
          {/* Image with enhanced shadow and subtle hover effect */}
          <div className="relative w-full flex justify-center group">
            <img
              src="https://delighted-peach-bnqknau0kr.edgeone.app/photo_2026-01-05_05-27-49.jpg"
              alt="Truth Hub - Revealing the Cosmic Christ"
              className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[85vh] object-contain drop-shadow-2xl transition-all duration-500 ease-out group-hover:drop-shadow-3xl group-hover:scale-[1.02]"
              loading="eager"
            />
            {/* Decorative glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
          
          {/* Subtitle with improved typography and spacing */}
          <div className="relative animate-in slide-in-from-bottom-6 duration-1000 delay-300">
            <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-[#3C1414] italic max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl leading-relaxed sm:leading-loose px-4 sm:px-6 font-serif">
              Welcome to the Truth Hub Blog, a Christocentric platform aimed to reveal the Cosmic Christ to all and in all aspects. We present to you the Gospel of Love, that will not only mend your Soul unto eternal Peace, but will give you a new definition of Life; an everlasting assurance of triumph in all things; through the Knowledge of Christ revealed to us!
            </p>
            {/* Subtle decorative line */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="h-0.5 w-16 sm:w-20 bg-gradient-to-r from-transparent via-[#3C1414]/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced bottom fade with smoother gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 md:h-32 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
  );
}
