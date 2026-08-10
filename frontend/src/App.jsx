import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { UploadCloud, Download, Loader2, Sliders, Sparkles } from 'lucide-react';

export default function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [scaleFactor, setScaleFactor] = useState('2x');

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
    formData.append('scale', scaleFactor);

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    try {
      const res = await fetch(`${API_URL}/api/enhance`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to enhance image');
      
      setEnhancedUrl(data.resultUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white p-6 md:p-12 flex flex-col items-center justify-center font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      
      {/* BACKGROUND GLOW ORBS (iOS Style) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      {/* HEADER */}
      <div className="text-center mb-8 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-300 mb-4 shadow-lg">
          <Sparkles className="w-3.5 h-3.5" /> iOS Glass Edition
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
          RKC AI STUDIO
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-light">
          Natural Skin Texture, Hair Detail Restoration & Ultra Upscaling
        </p>
      </div>

      {/* DRAG & DROP ZONE (Glassmorphism) */}
      {!originalUrl && (
        <div 
          {...getRootProps()} 
          className={`w-full max-w-2xl p-12 rounded-3xl text-center cursor-pointer transition-all duration-500 backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] z-10 ${
            isDragActive ? 'border-blue-400 bg-blue-500/10 scale-102' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-purple-600/30 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-10 h-10 text-blue-300 animate-bounce" />
          </div>
          <p className="text-xl font-semibold mb-1 text-slate-100">Drag & drop your photo here</p>
          <p className="text-sm text-slate-400 font-light">Supports portraits, nature, and low-res details</p>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-red-200 p-4 rounded-2xl mb-6 max-w-2xl w-full text-center z-10 shadow-lg">
          Error: {error}
        </div>
      )}

      {/* PREVIEW AND BEFORE/AFTER SLIDER (Glass Card) */}
      {originalUrl && (
        <div className="w-full max-w-3xl backdrop-blur-2xl bg-white/5 p-6 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10 transition-all duration-500 z-10 animate-fadeIn">
          
          {/* QUALITY SELECTOR */}
          <div className="flex items-center justify-between mb-4 backdrop-blur-md bg-white/5 p-3 rounded-2xl border border-white/10 shadow-inner">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
              <Sliders className="w-4 h-4 text-blue-400" />
              Upscale Quality:
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setScaleFactor('2x')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  scaleFactor === '2x' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 border border-blue-400/30' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                2x HD
              </button>
              <button
                onClick={() => setScaleFactor('4x')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  scaleFactor === '4x' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 border border-purple-400/30' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                4x Ultra
              </button>
            </div>
          </div>

          <div className="relative aspect-video bg-black/40 rounded-2xl overflow-hidden mb-6 flex items-center justify-center border border-white/10 shadow-2xl">
            {enhancedUrl ? (
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original Photo" />}
                itemTwo={<ReactCompareSliderImage src={enhancedUrl} alt="Enhanced Photo" />}
                className="w-full h-full"
              />
            ) : (
              <img src={originalUrl} className="max-h-full object-contain" alt="Preview" />
            )}

            {/* LOADING OVERLAY (Glass Blur) */}
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-300">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <p className="text-lg font-semibold text-blue-200 tracking-wide">Restoring skin, hair & pixels...</p>
                <p className="text-xs text-slate-400 mt-1">Applying natural texture enhancement...</p>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4">
            {!enhancedUrl ? (
              <button 
                onClick={handleEnhance}
                disabled={isProcessing}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 border border-blue-400/30 disabled:opacity-50 cursor-pointer transform hover:-scale-102 active:scale-95"
              >
                {isProcessing ? 'Processing...' : `Enhance & Upscale (${scaleFactor})`}
              </button>
            ) : (
              <a 
                href={enhancedUrl}
                download="RKC_Enhanced_Photo.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-emerald-600/30 border border-emerald-400/30 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Download className="w-5 h-5" /> Download High-Quality Photo
              </a>
            )}
            
            <button 
              onClick={() => { setOriginalUrl(null); setEnhancedUrl(null); setOriginalFile(null); }}
              disabled={isProcessing}
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-2xl transition-all duration-300 border border-white/10 backdrop-blur-md cursor-pointer"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}