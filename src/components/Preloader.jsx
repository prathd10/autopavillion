import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [lettersVisible, setLettersVisible] = useState(0);
  const [showUnderline, setShowUnderline] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [muted, setMuted] = useState(false);

  const brandName = "AUTO PAVILION";

  useEffect(() => {
    // Play subtle synthesized engine acoustic rumble
    let audioCtx = null;
    if (!muted) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(45, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(75, audioCtx.currentTime + 1.2);
        osc.frequency.exponentialRampToValueAtTime(30, audioCtx.currentTime + 2.5);
        
        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 1.0);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.6);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 2.8);
      } catch (e) {
        console.log("Audio synth note:", e);
      }
    }

    const letterTimer = setInterval(() => {
      setLettersVisible((prev) => {
        if (prev < brandName.length) {
          return prev + 1;
        } else {
          clearInterval(letterTimer);
          setTimeout(() => setShowUnderline(true), 120);
          setTimeout(() => setShowTagline(true), 500);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              if (audioCtx) audioCtx.close();
              onComplete();
            }, 700);
          }, 2200);
          return prev;
        }
      });
    }, 85);

    return () => {
      clearInterval(letterTimer);
      if (audioCtx) audioCtx.close();
    };
  }, [muted]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white transition-all duration-800 ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top minimal badge */}
      <div className="mb-6 flex items-center space-x-3 opacity-60">
        <span className="h-[1px] w-8 bg-white" />
        <span className="text-[11px] uppercase tracking-[0.3em] font-mulish text-white font-semibold">
          Automotive Excellence
        </span>
        <span className="h-[1px] w-8 bg-white" />
      </div>

      {/* Main Animated Name */}
      <div className="relative px-6 py-2 text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-mulish tracking-[0.25em] text-white flex items-center justify-center flex-wrap">
          {brandName.split('').map((char, index) => (
            <span
              key={index}
              className={`inline-block transition-all duration-300 transform ${
                index < lettersVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-3'
              } ${char === ' ' ? 'w-4 sm:w-8' : ''}`}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Animated Pure White Underline */}
        <div className="relative mt-4 h-[2px] w-full max-w-lg mx-auto overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full bg-white transition-all duration-700 ease-out ${
              showUnderline ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`}
          />
        </div>

        {/* Tagline Reveal */}
        <p
          className={`mt-4 text-xs font-semibold tracking-[0.4em] text-zinc-400 uppercase transition-all duration-700 ${
            showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          A Notch Above <span className="text-white mx-2">•</span> Santacruz West, Mumbai
        </p>
      </div>

      {/* Acoustic Audio toggle */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-10 right-10 flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs text-zinc-300 backdrop-blur-md transition-all hover:bg-white hover:text-black"
      >
        {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        <span>{muted ? 'Audio Off' : 'Sound On'}</span>
      </button>

      {/* Skip Intro */}
      <button
        onClick={() => {
          setFadeOut(true);
          setTimeout(onComplete, 200);
        }}
        className="absolute bottom-10 left-10 text-xs text-zinc-500 hover:text-white tracking-widest uppercase transition-colors"
      >
        Skip →
      </button>
    </div>
  );
}
