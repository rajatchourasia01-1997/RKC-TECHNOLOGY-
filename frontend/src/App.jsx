import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { UploadCloud, Download, Loader2, Sliders, Sparkles, Camera } from 'lucide-react';

export default function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Customization States
  const [selectedPreset, setSelectedPreset] = useState('crisp');
  
  // Pro Adjustment Sliders
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
    <div className="min-h-screen text-white p-4 md:p-8 flex flex-col items-center justify-center font-sans relative overflow-x-hidden">
      
      {/* CINEMATIC BACKGROUND WALLPAPER & FROSTED GLASS OVERLAY */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-40 scale-105 pointer-events-none z-0"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2000&auto=format&fit=crop')` }}
      ></div>
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl z-0 pointer-events-none"></div>

      {/* HEADER */}
      <div className="text-center mb-6 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-bold text-blue-300 mb-3 shadow-lg">
          <Camera className="w-3.5 h-3.5" /> Professional Cinematic Color Studio
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-blue-200 to-indigo-400 bg-clip-text text-transparent drop-shadow-md">
          RKC PHOTO STUDIO
        </h1>
        <p className="text-slate-300 text-sm md:text-base font-light">
          High-End Portrait Grading, Lighting Tweaks & Cinematic Presets
        </p>
      </div>

      {/* STYLE PRESETS (Choose Before Uploading) */}
      <div className="w-full max-w-3xl backdrop-blur-2xl bg-white/10 p-4 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 mb-6 z-10">
        <label className="block text-xs font-semibold uppercase tracking-wider text-blue-300 mb-3 text-center">
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
              className={`p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                selectedPreset === preset.id 
                  ? 'bg-blue-600/40 border-blue-400 shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-sm text-white">{preset.label}</div>
              <div className="text-[10px] text-slate-300 font-light">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* DRAG & DROP ZONE */}
      {!originalUrl && (
        <div 
          {...getRootProps()} 
          className={`w-full max-w-3xl p-10 rounded-3xl text-center cursor-pointer transition-all duration-500 backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl hover:bg-white/15 hover:border-white/30 z-10 ${
            isDragActive ? 'border-blue-400 bg-blue-500/20 scale-102' : ''
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-blue-500/30 to-indigo-500/30 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-inner">
            <UploadCloud className="w-10 h-10 text-blue-300 animate-bounce" />
          </div>
          <p className="text-xl font-semibold mb-1 text-white">2. Drop your portrait, pet, or landscape here</p>
          <p className="text-sm text-slate-300 font-light">Instant professional color grading and detail restoration</p>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/40 text-red-200 p-4 rounded-2xl mb-6 max-w-3xl w-full text-center z-10">
          Error: {error}
        </div>
      )}

      {/* PREVIEW & PRO EDITORS */}
      {originalUrl && (
        <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/10 p-6 rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 z-10 flex flex-col gap-6">
          
          {/* IMAGE COMPARISON CONTAINER */}
          <div className="relative aspect-video bg-black/60 rounded-2xl overflow-hidden flex items-center justify-center border border-white/15 shadow-inner">
            {enhancedUrl ? (
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original" />}
                itemTwo={<ReactCompareSliderImage src={enhancedUrl} alt="Graded Photo" />}
                className="w-full h-full"
              />
            ) : (
              <img src={originalUrl} className="max-h-full object-contain" alt="Preview" />
            )}

            {/* LOADING OVERLAY */}
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                <p className="text-lg font-semibold text-blue-200">Applying professional grade...</p>
                <p className="text-xs text-slate-400 mt-1">Rendering exposure, contrast & textures...</p>
              </div>
            )}
          </div>

          {/* PRO EDITING SLIDERS PANEL */}
          <div className="backdrop-blur-xl bg-white/5 p-4 rounded-2xl border border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-300 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Fine-Tune Adjustments
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-300 flex justify-between mb-1">Brightness <span>{brightness}</span></label>
                <input type="range" min="-50" max="50" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="w-full accent-blue-500 cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-300 flex justify-between mb-1">Contrast <span>{contrast}</span></label>
                <input type="range" min="-50" max="50" value={contrast} onChange={(e) => setContrast(e.target.value)} className="w-full accent-blue-500 cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-300 flex justify-between mb-1">Saturation <span>{saturation}</span></label>
                <input type="range" min="-50" max="50" value={saturation} onChange={(e) => setSaturation(e.target.value)} className="w-full accent-blue-500 cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-300 flex justify-between mb-1">Sharpness <span>{sharpness}</span></label>
                <input type="range" min="0" max="100" value={sharpness} onChange={(e) => setSharpness(e.target.value)} className="w-full accent-blue-500 cursor-pointer" />
              </div>
              <div>
                <label className="text-slate-300 flex justify-between mb-1">Vignette <span>{vignette}</span></label>
                <input type="range" min="0" max="100" value={vignette} onChange={(e) => setVignette(e.target.value)} className="w-full accent-blue-500 cursor-pointer" />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4">
            {!enhancedUrl ? (
              <button 
                onClick={handleEnhance}
                disabled={isProcessing}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/30 border border-blue-400/30 disabled:opacity-50 cursor-pointer transform hover:scale-[1.02]"
              >
                {isProcessing ? 'Processing...' : 'Apply Cinematic Grade'}
              </button>
            ) : (
              <a 
                href={enhancedUrl}
                download="RKC_Cinematic_Photo.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-emerald-600/30 border border-emerald-400/30 cursor-pointer"
              >
                <Download className="w-5 h-5" /> Download Masterpiece
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