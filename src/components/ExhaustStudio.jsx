import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Radio, Flame } from 'lucide-react';

export default function ExhaustStudio() {
  const [activeEngine, setActiveEngine] = useState('flat6');
  const [isRevving, setIsRevving] = useState(false);
  const [rpm, setRpm] = useState(900);
  const canvasRef = useRef(null);

  const engines = [
    {
      id: 'flat6',
      name: 'Porsche 4.0L Flat-6 GT3 RS',
      type: 'Naturally Aspirated Screamer',
      maxRpm: 9000,
      baseFreq: 140,
      revFreq: 480,
      desc: 'High-pitched motorsport howl that screams to a dizzying 9,000 RPM redline.',
      badge: 'FLAT-6 NA'
    },
    {
      id: 'v10',
      name: 'Lamborghini 5.2L V10 EVO',
      type: 'Italian Atmospheric V10',
      maxRpm: 8500,
      baseFreq: 110,
      revFreq: 420,
      desc: 'Piercing Italian symphony with raw mechanical throat and downshift crackles.',
      badge: 'V10 NA'
    },
    {
      id: 'v8amg',
      name: 'Mercedes-AMG 4.0L V8 Biturbo',
      type: 'German Twin-Turbo V8 Thunder',
      maxRpm: 7200,
      baseFreq: 65,
      revFreq: 260,
      desc: 'Deep bass thud rumble with menacing pops and overrun burbles.',
      badge: 'V8 BITURBO'
    },
    {
      id: 'v12',
      name: 'Rolls-Royce / Ferrari 6.75L V12',
      type: 'Twelve-Cylinder Symphony',
      maxRpm: 8000,
      baseFreq: 85,
      revFreq: 360,
      desc: 'Velvety smooth power build with intense, refined pitch resonance.',
      badge: 'V12 SYMPHONY'
    }
  ];

  const currentConfig = engines.find((e) => e.id === activeEngine) || engines[0];

  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const startSound = (isFullThrottle = false) => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (oscRef.current) {
        oscRef.current.stop();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = activeEngine === 'v8amg' ? 'sawtooth' : 'triangle';
      
      const targetFreq = isFullThrottle ? currentConfig.revFreq : currentConfig.baseFreq;
      osc.frequency.setValueAtTime(currentConfig.baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(targetFreq, ctx.currentTime + (isFullThrottle ? 0.8 : 0.2));

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch (err) {
      console.log('Audio synth:', err);
    }
  };

  const stopSound = () => {
    if (gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.3);
        setTimeout(() => {
          if (oscRef.current) {
            oscRef.current.stop();
            oscRef.current = null;
          }
        }, 300);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleRevStart = () => {
    setIsRevving(true);
    startSound(true);
  };

  const handleRevEnd = () => {
    setIsRevving(false);
    stopSound();
  };

  useEffect(() => {
    let interval;
    if (isRevving) {
      interval = setInterval(() => {
        setRpm((prev) => Math.min(prev + 450, currentConfig.maxRpm));
      }, 50);
    } else {
      interval = setInterval(() => {
        setRpm((prev) => Math.max(prev - 350, 900));
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isRevving, currentConfig]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 32;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = isRevving
          ? Math.random() * (canvas.height * 0.85) + 15
          : Math.sin(Date.now() * 0.005 + i) * 10 + 15;

        ctx.fillStyle = isRevving ? '#ffffff' : '#555555';
        ctx.fillRect(i * barWidth + 2, canvas.height - height, barWidth - 4, height);
      }
      animFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [isRevving]);

  return (
    <section id="sound-studio" className="py-20 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest text-white">
            <Radio className="w-3.5 h-3.5" />
            <span>Interactive Acoustic Sound Studio</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading uppercase">
            EXHAUST ACOUSTIC <span className="text-zinc-400 font-extralight">STUDIO</span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm font-mulish">
            Experience the unfiltered mechanical acoustics of Flat-6, V10, and V8 engines in our minimal acoustic simulator.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-3">
            {engines.map((eng) => (
              <div
                key={eng.id}
                onClick={() => {
                  setActiveEngine(eng.id);
                  setRpm(900);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  activeEngine === eng.id
                    ? 'bg-white text-black border-white shadow-xl'
                    : 'bg-[#0a0a0a] hover:bg-zinc-900 border-white/10 text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded font-extrabold text-[9px] uppercase tracking-wider ${activeEngine === eng.id ? 'bg-black text-white' : 'bg-white/10 text-white'}`}>
                    {eng.badge}
                  </span>
                  <span className="text-xs font-mono">Max {eng.maxRpm} RPM</span>
                </div>

                <h4 className="text-lg font-bold mt-2 font-heading">{eng.name}</h4>
                <p className={`text-xs mt-1 ${activeEngine === eng.id ? 'text-zinc-700' : 'text-zinc-400'}`}>{eng.desc}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="mono-panel p-8 rounded-3xl border border-white/12 relative">
              
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-1">
                  Live Tachometer
                </span>

                <div className="font-mono font-black text-6xl sm:text-7xl text-white tracking-tight my-2">
                  {rpm.toLocaleString()}
                  <span className="text-xs text-zinc-500 font-mulish ml-2 font-normal">RPM</span>
                </div>

                <div className="w-full max-w-md h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10 my-4">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-75"
                    style={{ width: `${(rpm / currentConfig.maxRpm) * 100}%` }}
                  />
                </div>
              </div>

              <div className="my-4 h-24 bg-black rounded-xl p-2 border border-white/10 relative flex items-center justify-center overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onMouseDown={handleRevStart}
                  onMouseUp={handleRevEnd}
                  onTouchStart={handleRevStart}
                  onTouchEnd={handleRevEnd}
                  className={`w-full sm:w-auto px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all select-none ${
                    isRevving
                      ? 'bg-zinc-200 text-black scale-95'
                      : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  <Flame className="w-4 h-4 inline mr-2" />
                  <span>{isRevving ? 'FLOORING THROTTLE!' : 'PRESS & HOLD PADDLE TO REV'}</span>
                </button>

                <button
                  onClick={() => {
                    startSound(false);
                    setTimeout(stopSound, 1000);
                  }}
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-black border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10"
                >
                  <Volume2 className="w-4 h-4 inline mr-1.5" />
                  <span>Quick Startup Blip</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
