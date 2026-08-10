import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { UploadCloud, Download, Loader2 } from 'lucide-react';

export default function App() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

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

    try {
      const res = await fetch('http://localhost:3001/api/enhance', {
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
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center font-sans">
      {/* HEADER */}
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-blue-400">
        WELCOME TO RKC
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        AI Photo Upscaler & Detail Restoration
      </p>

      {/* DRAG & DROP ZONE */}
      {!originalUrl && (
        <div 
          {...getRootProps()} 
          className={`w-full max-w-2xl p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
            isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-16 h-16 mx-auto mb-4 text-blue-400 animate-bounce" />
          <p className="text-xl font-medium mb-1">Drag & drop your blurry photo here</p>
          <p className="text-sm text-gray-500">or click to browse your files</p>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 max-w-2xl w-full text-center">
          Error: {error}
        </div>
      )}

      {/* PREVIEW AND BEFORE/AFTER SLIDER */}
      {originalUrl && (
        <div className="w-full max-w-3xl bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-gray-700">
          <div className="relative aspect-video bg-black/80 rounded-xl overflow-hidden mb-6 flex items-center justify-center">
            
            {enhancedUrl ? (
              <ReactCompareSlider
                itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original Blurry Photo" />}
                itemTwo={<ReactCompareSliderImage src={enhancedUrl} alt="Enhanced Photo" />}
                className="w-full h-full"
              />
            ) : (
              <img src={originalUrl} className="max-h-full object-contain" alt="Preview" />
            )}

            {/* LOADING OVERLAY */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
                <p className="text-lg font-semibold text-blue-300">Restoring pixels & upscaling...</p>
                <p className="text-xs text-gray-400 mt-1">This usually takes about 10-20 seconds</p>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4">
            {!enhancedUrl ? (
              <button 
                onClick={handleEnhance}
                disabled={isProcessing}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? 'Enhancing...' : 'Enhance & Upscale Photo'}
              </button>
            ) : (
              <a 
                href={enhancedUrl}
                download="RKC_Enhanced_Photo.jpg"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/25 cursor-pointer"
              >
                <Download className="w-5 h-5" /> Download High-Quality Photo
              </a>
            )}
            
            <button 
              onClick={() => { setOriginalUrl(null); setEnhancedUrl(null); setOriginalFile(null); }}
              disabled={isProcessing}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-all cursor-pointer"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}