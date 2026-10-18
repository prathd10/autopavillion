import React, { useEffect, useState } from 'react';

export default function Preloader({ onComplete }) {
  const [lettersVisible, setLettersVisible] = useState(0);
  const [showUnderline, setShowUnderline] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Exact letter cutoffs for Auto Pavilion logo image (1108x158)
  // "A", "u", "t", "o", " ", "P", "a", "v", "i", "l", "i", "o", "n" (13 steps)
  const cutoffs = [0, 11.5, 19.5, 26.5, 36.5, 43.5, 50.5, 56.5, 61.5, 70.0, 74.5, 79.5, 84.0, 100];
  const totalSteps = cutoffs.length - 1;

  useEffect(() => {
    const letterTimer = setInterval(() => {
      setLettersVisible((prev) => {
        if (prev < totalSteps) {
          return prev + 1;
        } else {
          clearInterval(letterTimer);
          // Reveal underline and gold sheen quickly after letters appear
          setTimeout(() => setShowUnderline(true), 60);
          // Hold gold sheen briefly so user appreciates the brand, then fade out smoothly
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              onComplete();
            }, 500);
          }, 950);
          return prev;
        }
      });
    }, 55); // 13 steps * 55ms = ~715ms letter reveal

    return () => {
      clearInterval(letterTimer);
    };
  }, [onComplete]);

  const currentPercent = cutoffs[lettersVisible] || 0;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-all duration-500 ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Metallic Gold Sheen CSS */}
      <style>{`
        @keyframes subtleGoldShine {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .gold-shine-mask {
          background: linear-gradient(110deg, #D4AF37 35%, #FFFDF0 50%, #D4AF37 65%);
          background-size: 200% 100%;
          animation: subtleGoldShine 2.5s linear infinite;
        }
      `}</style>

      {/* Main Animated Logo */}
      <div className="relative px-4 sm:px-6 py-2 text-center w-full max-w-4xl mx-auto overflow-hidden">
        <div className="relative mx-auto w-[270px] min-[360px]:w-[310px] sm:w-[480px] md:w-[600px] lg:w-[680px] aspect-[1108/158] flex items-center justify-center">
          {/* Logo container with letter-by-letter reveal */}
          <div
            className="w-full h-full relative"
            style={{
              clipPath: `inset(0 ${100 - currentPercent}% 0 0)`,
              transition: 'clip-path 55ms linear',
            }}
          >
            {/* Base Logo Image (Crisp white during reveal, transitions to original gold) */}
            <img
              src="/logo.png"
              alt="Auto Pavilion"
              className={`w-full h-full object-contain transition-all duration-400 ${
                showUnderline ? 'opacity-100 filter-none' : 'brightness-0 invert opacity-95'
              }`}
            />

            {/* Metallic Gold Sheen Overlay when fully revealed */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                showUnderline ? 'opacity-100 gold-shine-mask' : 'opacity-0'
              }`}
              style={{
                maskImage: 'url(/logo.png)',
                WebkitMaskImage: 'url(/logo.png)',
                maskSize: 'contain',
                WebkitMaskSize: 'contain',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
                mixBlendMode: 'screen',
              }}
            />
          </div>
        </div>

        {/* Subtle Gold Underline */}
        <div className="relative mt-5 sm:mt-6 h-[2px] w-full max-w-xs sm:max-w-lg mx-auto overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full bg-[#D4AF37] transition-all duration-500 ease-out shadow-[0_0_8px_rgba(212,175,55,0.4)] ${
              showUnderline ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
}

