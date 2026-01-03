export function Hero() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B7355] via-[#6B563F] to-background opacity-90" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 md:py-32 flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full flex flex-col items-center">
          <img
            src="https://cdn-ai.onspace.ai/onspace/files/BBCNkfqLLLYkRHphzsum4m/pasted-image-1767366127868-1.png"
            alt="Truth Hub - Revealing the Cosmic Christ"
            className="w-full max-w-3xl h-auto drop-shadow-2xl transform transition-transform duration-300 hover:scale-105"
          />
          
          {/* Subtitle */}
          <p className="mt-8 text-center text-lg md:text-xl text-white/90 font-light max-w-2xl leading-relaxed">
            A Christocentric platform exploring the nature of man, society, systems, and the cosmos through the lens of divine truth
          </p>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
