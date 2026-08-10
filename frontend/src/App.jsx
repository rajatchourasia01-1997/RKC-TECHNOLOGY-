import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { UploadCloud, Download, Loader2, Sliders } from 'lucide-react';

export default function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [scaleFactor, setScaleFactor] = useState('2x'); // Added 2x / 4x state

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
    formData.append('scale', scaleFactor); // Send 2x or 4x to backend

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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 md:p-12 flex flex-col items-center justify-center font-sans transition-all duration-500">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          RKC AI STUDIO
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Natural Skin Texture, Hair Detail Restoration & Ultra Upscaling
        </p>
      </div>

      {/* DRAG & DROP ZONE */}
      {!originalUrl && (
        <div 
          {...getRootProps()} 
          className={`w-full max-w-2xl p-12 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${
            isDragActive ? 'border-blue-500 bg-blue-500/10 scale-102' : 'border-gray-700 bg-gray-900/60 hover:border-gray-500 shadow-2xl'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-bounce" />
          <p className="text-xl font-medium mb-1">Drag & drop your photo here</p>
          <p className="text-sm text-gray-500">Supports portraits, nature, and low-res details</p>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-2xl mb-6 max-w-2xl w-full text-center animate-shake">
          Error: {error}
        </div>
      )}

      {/* PREVIEW AND BEFORE/AFTER SLIDER */}
      {originalUrl && (
        <div className="w-full max-w-3xl bg-gray-900/80 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-gray-800 transition-all duration-500 animate-fadeIn">
          
          {/* QUALITY SELECTOR */}
          <div className="flex items-center justify-between mb-4 bg-gray-800/50 p-3 rounded-2xl border border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
              <Sliders className="w-4 h-4 text-blue-400" />
              Upscale Quality:
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setScaleFactor('2x')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  scaleFactor === '2x' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                2x HD
              </button>
              <button
                onClick={() => setScaleFactor('4x')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  scaleFactor === '4x' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                4x Ultra
              </button>
            </div>
          </div>

          <div className="relative aspect-video bg-black/90 rounded-2xl overflow-hidden mb-6 flex items-center justify-center border border-gray-800 shadow-inner">
            {enhancedUrl ? (
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original Photo" />}
                itemTwo={<ReactCompareSliderImage src={enhancedUrl} alt="Enhanced Photo" />}
                className="w-full h-full"
              />
            ) : (
              <img src={originalUrl} className="max-h-full object-contain" alt="Preview" />
            )}

            {/* LOADING OVERLAY */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-300">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                <p className="text-lg font-semibold text-blue-300">Restoring hair, skin & pixels ({scaleFactor})...</p>
                <p className="text-xs text-gray-400 mt-1">Applying natural texture enhancement...</p>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4">
            {!enhancedUrl ? (
              <button 
                onClick={handleEnhance}
                disabled={isProcessing}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5"
              >
                {isProcessing ? 'Processing...' : `Enhance & Upscale (${scaleFactor})`}
              </button>
            ) : (
              <a 
                href={enhancedUrl}
                download="RKC_Enhanced_Photo.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl flex items-center gap-2 transition-all duration-300 shadow-xl shadow-emerald-600/20 cursor-pointer transform hover:-translate-y-0.5 animate-bounce-short"
              >
                <Download className="w-5 h-5" /> Download High-Quality Photo
              </a>
            )}
            
            <button 
              onClick={() => { setOriginalUrl(null); setEnhancedUrl(null); setOriginalFile(null); }}
              disabled={isProcessing}
              className="px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-2xl transition-all duration-300 border border-gray-700 cursor-pointer"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}