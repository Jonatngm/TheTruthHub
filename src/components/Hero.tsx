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
          <p className="mt-8 text-center text-xl md:text-2xl text-black font-bold max-w-2xl leading-relaxed">
           Welcome to the Truth Hub Blog, a Christocentric platform aimed to reveal the Cosmic Christ to all and in all aspects. We present to you the Gospel of Love, that will not only mend your Soul unto eternal Peace, but will give you a new definition of Life; an everlasting assurance of triumph in all; through the Knowledge that is in Christ Jesus!
          </p>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
