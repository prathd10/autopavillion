import React, { useEffect, useState } from 'react';

export default function Preloader({ onComplete }) {
  const [lettersVisible, setLettersVisible] = useState(0);
  const [showUnderline, setShowUnderline] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const brandName = "AUTO PAVILION";

  useEffect(() => {
    const letterTimer = setInterval(() => {
      setLettersVisible((prev) => {
        if (prev < brandName.length) {
          return prev + 1;
        } else {
          clearInterval(letterTimer);
          setTimeout(() => setShowUnderline(true), 120);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              onComplete();
            }, 700);
          }, 2200);
          return prev;
        }
      });
    }, 85);

    return () => {
      clearInterval(letterTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-all duration-800 ${
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
        .gold-shine-text {
          background: linear-gradient(110deg, #D4AF37 35%, #FFFDF0 50%, #D4AF37 65%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: subtleGoldShine 3.5s linear infinite;
        }
      `}</style>

      {/* Main Animated Name */}
      <div className="relative px-3 sm:px-6 py-2 text-center w-full max-w-4xl mx-auto overflow-hidden">
        <h1 
          className="text-[20px] min-[360px]:text-[24px] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[0.1em] sm:tracking-[0.18em] flex items-center justify-center whitespace-nowrap overflow-hidden"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {brandName.split('').map((char, index) => (
            <span
              key={index}
              className={`inline-block transition-all duration-500 transform shrink-0 ${
                index < lettersVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              } ${showUnderline ? 'gold-shine-text' : 'text-white'} ${char === ' ' ? 'w-2 sm:w-6' : ''}`}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Subtle Gold Underline */}
        <div className="relative mt-4 h-[2px] w-full max-w-xs sm:max-w-lg mx-auto overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full bg-[#D4AF37] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(212,175,55,0.4)] ${
              showUnderline ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
