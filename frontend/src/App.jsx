import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { UploadCloud, Download, Loader2, Sliders, Camera } from 'lucide-react';

export default function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isPressed, setIsPressed] = useState(false);
  
  const [selectedPreset, setSelectedPreset] = useState('crisp');
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [sharpness, setSharpness] = useState(0);
  const [vignette, setVignette] = useState(0);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setEnhancedUrl(null);
    setError(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleEnhance = async () => {
    if (!originalFile) return;
    setIsProcessing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', originalFile);
    formData.append('preset', selectedPreset);
    formData.append('brightness', brightness);
    formData.append('contrast', contrast);
    formData.append('saturation', saturation);
    formData.append('sharpness', sharpness);
    formData.append('vignette', vignette);

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${API_URL}/api/enhance`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to process image');
      
      setEnhancedUrl(data.resultUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans relative overflow-x-hidden selection:bg-pink-500 selection:text-white">
      
      {/* 100% VISIBLE ANDROMEDA / BARRED SPIRAL GALAXY BACKGROUND */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat filter brightness-125 saturate-150 scale-105 pointer-events-none z-0"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')` }}
      ></div>

      {/* VIVID COLORFUL TWINKLING STARS SCATTERED ACROSS SPACE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 left-1/4 w-3.5 h-3.5 bg-pink-400 rounded-full animate-ping shadow-[0_0_25px_#ec4899]"></div>
        <div className="absolute top-1/4 left-1/6 w-3 h-3 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_20px_#06b6d4]"></div>
        <div className="absolute top-24 right-1/4 w-4 h-4 bg-purple-400 rounded-full animate-pulse shadow-[0_0_30px_#a855f7]"></div>
        <div className="absolute top-1/2 right-1/6 w-3.5 h-3.5 bg-yellow-200 rounded-full animate-ping shadow-[0_0_25px_#fde047]"></div>
        <div className="absolute top-3/4 left-1/6 w-3 h-3 bg-blue-400 rounded-full animate-ping shadow-[0_0_20px_#3b82f6]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3.5 h-3.5 bg-pink-300 rounded-full animate-pulse shadow-[0_0_25px_#f472b6]"></div>
        <div className="absolute bottom-24 right-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-ping shadow-[0_0_30px_#22d3ee]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-emerald-300 rounded-full animate-pulse shadow-[0_0_20px_#34d399]"></div>
      </div>

      {/* ZERO DARK OVERLAY: Galaxy shines at 100% clarity with pure iOS Glass Frosted Effect */}

      {/* HEADER */}
      <div className="text-center mb-6 z-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.12] backdrop-blur-3xl border border-white/40 text-xs font-bold text-cyan-300 mb-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <Camera className="w-4 h-4 text-cyan-300 animate-pulse" /> iOS Glass Andromeda Edition
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-cyan-200 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
          RKC PHOTO STUDIO
        </h1>
        <p className="text-slate-100 text-sm md:text-base font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          High-End Portrait Grading under the Andromeda Galaxy
        </p>
      </div>

      {/* STYLE PRESETS (Bright Colorful iOS Glass) */}
      <div className="w-full max-w-3xl backdrop-blur-3xl bg-white/[0.08] p-5 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/30 mb-6 z-10">
        <label className="block text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 text-center drop-shadow">
          1. Select Cinematic Look
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'crisp', label: 'Crisp HD', desc: 'Clean Portrait Detail' },
            { id: 'cinematic', label: 'Cinematic Warm', desc: 'Rich & Balanced Tones' },
            { id: 'noir', label: 'Moody Noir', desc: 'High Contrast B&W' },
            { id: 'golden', label: 'Golden Hour', desc: 'Warm Glow & Soft Light' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border backdrop-blur-xl ${
                selectedPreset === preset.id 
                  ? 'bg-cyan-500/40 border-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.8)] ring-2 ring-cyan-200' 
                  : 'bg-white/[0.06] border-white/20 hover:bg-white/[0.15]'
              }`}
            >
              <div className="font-bold text-sm text-white drop-shadow">{preset.label}</div>
              <div className="text-[10px] text-slate-200 font-medium">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* DRAG & DROP ZONE (Bright iOS Glass) */}
      {!originalUrl && (
        <div 
          {...getRootProps()} 
          className={`w-full max-w-3xl p-10 rounded-3xl text-center cursor-pointer transition-all duration-500 backdrop-blur-3xl bg-white/[0.08] border border-white/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:bg-white/[0.14] hover:border-white/50 z-10 ${
            isDragActive ? 'border-cyan-300 bg-cyan-500/30 scale-102' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-500/50 to-pink-500/50 backdrop-blur-3xl border border-white/50 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)]">
            <UploadCloud className="w-10 h-10 text-cyan-200 animate-bounce" />
          </div>
          <p className="text-xl font-bold mb-1 text-white drop-shadow">2. Drop your portrait or photo here</p>
          <p className="text-sm text-slate-200 font-medium">Instant professional color grading with brilliant space clarity</p>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-500/30 backdrop-blur-3xl border border-red-500/60 text-red-100 p-4 rounded-2xl mb-6 max-w-3xl w-full text-center z-10 shadow-lg">
          Error: {error}
        </div>
      )}

      {/* PREVIEW & DYNAMIC IOS GLASS COMPARISON WIDGET */}
      {originalUrl && (
        <div className="w-full max-w-4xl backdrop-blur-3xl bg-white/[0.09] p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/30 transition-all duration-500 z-10 flex flex-col gap-6">
          
          {/* INTERACTIVE COMPARISON CONTAINER WITH MULTICOLOR GLOW ON PRESS */}
          <div 
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className={`relative w-full h-[320px] md:h-[450px] bg-black/30 rounded-2xl overflow-hidden flex items-center justify-center border transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${
              isPressed 
                ? 'border-pink-500 shadow-[0_0_60px_rgba(236,72,153,0.9),0_0_120px_rgba(6,182,212,0.7)] ring-4 ring-pink-400/70' 
                : 'border-white/30'
            }`}
          >
            {enhancedUrl ? (
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original" className="object-contain w-full h-full" />}
                itemTwo={<ReactCompareSliderImage src={enhancedUrl} alt="Graded Photo" className="object-contain w-full h-full" />}
                className="w-full h-full"
              />
            ) : (
              <img src={originalUrl} className="max-h-full max-w-full object-contain" alt="Preview" />
            )}

            {/* LOADING OVERLAY */}
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-3xl flex flex-col items-center justify-center z-20">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                <p className="text-lg font-semibold text-cyan-200">Rendering master grade...</p>
                <p className="text-xs text-slate-300 mt-1">Applying professional lighting & texture pass...</p>
              </div>
            )}
          </div>

          {/* PRO EDITING SLIDERS PANEL */}
          <div className="backdrop-blur-3xl bg-white/[0.06] p-5 rounded-2xl border border-white/20 shadow-inner">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-2 drop-shadow">
              <Sliders className="w-4 h-4" /> Fine-Tune Adjustments
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-100 flex justify-between mb-1 font-semibold">Brightness <span>{brightness}</span></label>
                <input type="range" min="-50" max="50" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full accent-cyan-400 cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-100 flex justify-between mb-1 font-semibold">Contrast <span>{contrast}</span></label>
                <input type="range" min="-50" max="50" value={contrast} onChange={(e) => setContrast(e.target.value)} className="w-full accent-cyan-400 cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-100 flex justify-between mb-1 font-semibold">Saturation <span>{saturation}</span></label>
                <input type="range" min="-50" max="50" value={saturation} onChange={(e) => setSaturation(e.target.value)} className="w-full accent-cyan-400 cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-100 flex justify-between mb-1 font-semibold">Sharpness <span>{sharpness}</span></label>
                <input type="range" min="0" max="100" value={sharpness} onChange={(e) => setSharpness(e.target.value)} className="w-full accent-cyan-400 cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-100 flex justify-between mb-1 font-semibold">Vignette <span>{vignette}</span></label>
                <input type="range" min="0" max="100" value={vignette} onChange={(e) => setVignette(e.target.value)} className="w-full accent-cyan-400 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4">
            {!enhancedUrl ? (
              <button 
                onClick={handleEnhance}
                disabled={isProcessing}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_35px_rgba(6,182,212,0.8)] border border-cyan-300/60 disabled:opacity-50 cursor-pointer transform hover:scale-[1.02]"
              >
                {isProcessing ? 'Processing...' : 'Apply Cinematic Grade'}
              </button>
            ) : (
              <a 
                href={enhancedUrl}
                download="RKC_Cinematic_Photo.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-[0_0_35px_rgba(16,185,129,0.8)] border border-emerald-300/60 cursor-pointer"
              >
                <Download className="w-5 h-5" /> Download Masterpiece
              </a>
            )}
            
            <button 
              onClick={() => { setOriginalUrl(null); setEnhancedUrl(null); setOriginalFile(null); }}
              disabled={isProcessing}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-slate-100 font-semibold rounded-2xl transition-all duration-300 border border-white/30 backdrop-blur-md cursor-pointer shadow"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}