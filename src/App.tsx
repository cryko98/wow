import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Copy, Check, Plus, X as CloseIcon, ExternalLink, AlertTriangle, Trophy, Star, Coins, Crown } from 'lucide-react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import confetti from 'canvas-confetti';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Winner {
  id: string;
  username: string;
  image_url: string;
  created_at: string;
}

const CA = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

const XLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.933zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
  </svg>
);

const BackgroundElements = () => {
  const elements = [
    { Icon: Trophy, color: '#FFD700' },
    { Icon: Star, color: '#FFD700' },
    { Icon: Coins, color: '#39FF14' },
    { Icon: Crown, color: '#FFD700' },
    { Icon: Star, color: '#39FF14' },
    { Icon: Trophy, color: '#39FF14' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((item, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            opacity: 0,
            scale: 0.5,
            rotate: 0
          }}
          animate={{ 
            y: [null, '-20%', '120%'],
            opacity: [0, 0.2, 0],
            scale: [0.5, 1, 0.5],
            rotate: 360
          }}
          transition={{ 
            duration: 15 + Math.random() * 20, 
            repeat: Infinity, 
            delay: i * 2,
            ease: "linear"
          }}
          className="absolute"
        >
          <item.Icon size={32 + Math.random() * 64} color={item.color} />
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (configured) {
      fetchWinners();
    } else {
      setLoading(false);
    }
  }, [configured]);

  const fetchWinners = async () => {
    try {
      const { data, error } = await supabase
        .from('winners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setWinners(data || []);
    } catch (err) {
      console.error('Error fetching winners:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundElements />
      {/* Header */}
      <header className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b-4 border-[#FFD700] bg-[#050505] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD700] border-2 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-black font-display text-2xl">W</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight uppercase text-[#FFD700]">Wall of Winners</h1>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-[#111] border-2 border-[#FFD700] p-2 rounded shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white">
            <span className="font-mono text-xs font-bold uppercase opacity-50 text-[#FFD700]">CA:</span>
            <code className="font-mono text-sm font-bold truncate max-w-[150px] md:max-w-none">{CA}</code>
            <button 
              onClick={copyToClipboard}
              className="p-1 hover:bg-white/10 rounded transition-colors text-[#FFD700]"
            >
              {copied ? <Check size={16} className="text-[#39FF14]" /> : <Copy size={16} />}
            </button>
          </div>

          <a 
            href="https://x.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="brutal-btn py-2 px-4 flex items-center gap-2 text-sm"
          >
            <XLogo size={18} />
            <span>Follow $WoW</span>
          </a>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-6xl">
        {/* Configuration Warning */}
        {!configured && (
          <div className="mb-8 p-4 brutal-border bg-red-100 flex items-center gap-4">
            <AlertTriangle className="text-red-600 shrink-0" size={32} />
            <div className="text-left">
              <p className="font-bold text-red-600 uppercase">Supabase Not Configured!</p>
              <p className="text-sm">Please set <code className="bg-red-200 px-1">VITE_SUPABASE_URL</code> and <code className="bg-red-200 px-1">VITE_SUPABASE_ANON_KEY</code> in your environment variables to enable the wall.</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="mb-16 text-center relative z-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mb-6"
          >
            <div className="meme-card bg-[#FFD700] text-black rotate-[-2deg] border-black">
              <h2 className="font-display text-5xl md:text-7xl uppercase tracking-tighter">$WoW</h2>
            </div>
          </motion.div>
          
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="font-sans text-2xl md:text-3xl font-bold leading-tight">
              In the world of Solana, there are jeeters and there are <span className="underline decoration-4 decoration-[#39FF14]">WINNERS</span>.
            </p>
            <p className="text-lg md:text-xl opacity-80">
              $WoW is more than a coin; it's a statement. If you're a holder, you've already won. 
              Immortalize your victory on the Wall of Winners. It's your choice which one you'll be.
            </p>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="brutal-btn bg-[#FFD700] text-black text-2xl py-4 px-8 mt-4 animate-float"
            >
              Join the Wall
            </button>
          </div>
        </section>

        {/* The Wall */}
        <section className="space-y-8 relative z-10">
          <div className="flex items-center justify-between border-b-4 border-[#FFD700] pb-4">
            <h3 className="font-display text-4xl uppercase text-[#FFD700]">The Wall of Winners</h3>
            <div className="font-mono text-sm font-bold bg-[#FFD700] text-black px-3 py-1">
              {winners.length} WINNERS
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="meme-card h-64 animate-pulse bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              <AnimatePresence mode="popLayout">
                {winners.map((winner) => (
                  <motion.div
                    key={winner.id}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="meme-card group hover:rotate-2 transition-transform"
                  >
                    <div className="w-full aspect-square border-2 border-black overflow-hidden bg-gray-100">
                      <img 
                        src={winner.image_url} 
                        alt={winner.username}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="w-full flex items-center justify-between mt-2">
                      <span className="font-display text-lg truncate">@{winner.username}</span>
                      <a 
                        href={`https://x.com/${winner.username}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-black/40 hover:text-black transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Add Placeholder */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="meme-card border-dashed bg-black/5 hover:bg-black/10 transition-colors group"
              >
                <div className="w-full aspect-square border-2 border-dashed border-black/20 flex items-center justify-center">
                  <Plus size={48} className="text-black/20 group-hover:text-black/40 transition-colors" />
                </div>
                <span className="font-display text-lg text-black/20 group-hover:text-black/40">Your Spot Here</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="p-8 border-t-4 border-[#FFD700] bg-[#050505] text-center space-y-4 relative z-10">
        <p className="font-display text-2xl uppercase text-[#FFD700]">$WoW - Wall of Winners</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-[#FFD700] font-bold transition-colors">Twitter</a>
          <a href="#" className="hover:text-[#FFD700] font-bold transition-colors">DexScreener</a>
        </div>
        <p className="text-xs opacity-50 font-mono">© 2026 WALL OF WINNERS. NO FINANCIAL ADVICE. JUST WINNING.</p>
      </footer>

      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#1a1a1a] brutal-border p-8 space-y-6 text-white"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full text-[#39FF14]"
              >
                <CloseIcon size={24} />
              </button>

              <div className="text-center space-y-2">
                <h2 className="font-display text-4xl uppercase text-[#39FF14]">Join the Wall</h2>
                <p className="text-white/60">Upload your X profile to show the world you're a winner.</p>
              </div>

              <UploadForm 
                onSuccess={() => {
                  setIsModalOpen(false);
                  fetchWinners();
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#FFD700', '#FF4500', '#000000']
                  });
                }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError("File too big! Max 2MB.");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !file) {
      setError("Fill everything, winner!");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `winners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('winners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('winners')
        .getPublicUrl(filePath);

      // 3. Save to database
      const { error: dbError } = await supabase
        .from('winners')
        .insert([
          { username: username.replace('@', ''), image_url: publicUrl }
        ]);

      if (dbError) throw dbError;

      onSuccess();
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || "Something went wrong. Try again!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="font-display text-xl uppercase text-[#FFD700]">X Username</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-white/40">@</span>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="elonmusk"
            className="w-full pl-10 pr-4 py-3 brutal-border bg-[#0a0a0a] text-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-display text-xl uppercase text-[#FFD700]">Profile Picture</label>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "w-full aspect-square brutal-border border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors overflow-hidden bg-[#0a0a0a]",
            preview && "border-solid"
          )}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <Upload size={48} className="text-[#FFD700]/20 mb-2" />
              <span className="font-bold text-white/40">Click to upload</span>
            </>
          )}
        </div>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-red-600 font-bold text-center bg-red-900/20 p-2 border-2 border-red-600">
          {error}
        </p>
      )}

      <button 
        type="submit" 
        disabled={uploading}
        className="brutal-btn w-full bg-[#FFD700] text-black disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Publish Victory"}
      </button>
    </form>
  );
}
