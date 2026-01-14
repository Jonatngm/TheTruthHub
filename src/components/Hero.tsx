export function Hero() {
  return (
    <div className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B7355] via-[#6B563F] to-background opacity-90" />
      
      {/* Content */}
      <div className="relative container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16 h-full flex flex-col items-center justify-center">
        <div className="max-w-8xl w-full flex flex-col items-center">
          <img
            src="https://delighted-peach-bnqknau0kr.edgeone.app/photo_2026-01-05_05-27-49.jpg"
            alt="Truth Hub - Revealing the Cosmic Christ"
            className="w-full h-auto max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[90vh] object-contain drop-shadow-3xl transform transition-transform duration-700 hover:scale-100"
          />
          
          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 md:mt-8 text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#3C1414] italic max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl leading-relaxed px-2">
           Welcome to the Truth Hub Blog, a Christocentric platform aimed to reveal the Cosmic Christ to all and in all aspects. We present to you the Gospel of Love, that will not only mend your Soul unto eternal Peace, but will give you a new definition of Life; an everlasting assurance of triumph in all things; through the Knowledge of Christ revealed to us!
          </p>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
