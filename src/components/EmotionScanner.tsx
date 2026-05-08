import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RefreshCw, Heart, Zap, Brain, Sparkles } from 'lucide-react';
import { loadModels, detectEmotion, emotionTranslations } from '../lib/faceApi';
import { getMotivationalMessage } from '../lib/gemini';

/**
 * Componente principal EmotionScanner.
 * Este componente gerencia o stream de vídeo, a detecção de emoções e a interface do usuário.
 */
export default function EmotionScanner() {
  // Referência ao elemento de vídeo para manipulação direta da câmera
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Estados para gerenciar o carregamento dos modelos de IA e a interface
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Aguardando ativação do sistema...');
  const [isScanning, setIsScanning] = useState(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  /**
   * useEffect para carregar os modelos de IA assim que o componente é montado.
   */
  useEffect(() => {
    const init = async () => {
      try {
        setIsModelLoading(true);
        // Carrega os pesos dos modelos do face-api.js
        await loadModels();
        setIsModelLoaded(true);
      } catch (error) {
        console.error("Failed to load models:", error);
        setMessage("Erro ao carregar modelos de IA. Verifique sua conexão.");
      } finally {
        setIsModelLoading(false);
      }
    };
    init();
  }, []);

  /**
   * useEffect para anexar o stream da câmera ao elemento <video>
   * quando o stream é obtido do navegador.
   */
  useEffect(() => {
    if (videoRef.current && stream && isScanning) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(err => {
        console.warn("Auto-play failed, waiting for user interaction:", err);
      });
    }
  }, [stream, isScanning]);

  /**
   * Função para solicitar permissão e iniciar a câmera do usuário.
   */
  const startCamera = async () => {
    try {
      // Verifica se o navegador suporta as APIs necessárias
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Seu navegador não suporta acesso à câmera ou você está em uma conexão não segura (HTTP).");
      }

      setMessage("Solicitando acesso à câmera...");
      
      const constraints = {
        video: {
          facingMode: "user", // Usa a câmera frontal/do usuário
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };

      // Solicita o stream de vídeo ao navegador
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera stream obtained");
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Espera os metadados carregarem antes de tentar dar play
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Play error:", e));
        };
      }
      
      setStream(mediaStream);
      setIsScanning(true);
      setMessage("Sistema online. Analisando expressões...");
    } catch (err) {
      console.error("Error accessing camera:", err);
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido ao acessar a câmera.";
      setMessage(`ERRO: ${errorMsg}`);
      setIsScanning(false);
    }
  };

  /**
   * Loop de detecção: verifica as emoções a cada 2 segundos.
   * Usamos um intervalo para não sobrecarregar o processador do usuário.
   */
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning && isModelLoaded) {
      interval = setInterval(async () => {
        if (videoRef.current) {
          // Chama o serviço de detecção
          const result = await detectEmotion(videoRef.current);
          if (result && result.emotion !== currentEmotion) {
            // Se a emoção mudou, atualiza o estado e solicita uma nova mensagem motivacional
            setCurrentEmotion(result.emotion);
            updateMessage(result.emotion);
          }
        }
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [isScanning, isModelLoaded, currentEmotion]);

  /**
   * Atualiza a mensagem motivacional chamando o Gemini.
   */
  const updateMessage = async (emotion: string) => {
    setIsLoadingMessage(true);
    // Traduz para o português antes de enviar para o prompt do Gemini
    const translatedEmotion = emotionTranslations[emotion] || emotion;
    const newMessage = await getMotivationalMessage(translatedEmotion);
    setMessage(newMessage);
    setIsLoadingMessage(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#050505] text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-4xl"
      >
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl shadow-lg shadow-purple-500/20">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">Emotion AI <span className="text-cyan-400">Studio</span></h1>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Neural Emotion Recognition v2.0</p>
            </div>
          </div>
          {!isScanning && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCamera}
              disabled={isModelLoading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-colors ${
                isModelLoading 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-black hover:bg-cyan-400'
              }`}
            >
              {isModelLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Carregando IA...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Ativar Scanner</span>
                </>
              )}
            </motion.button>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera Viewport */}
          <div className="lg:col-span-2 relative group">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">
              {!isScanning ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <Camera className="w-16 h-16 opacity-20" />
                  <p className="text-sm font-mono uppercase tracking-widest">Aguardando sinal...</p>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline
                    className="w-full h-full object-cover brightness-110 contrast-110"
                  />
                  {/* Scanning Overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-scan" />
                    <div className="absolute inset-0 border-[20px] border-black/20" />
                    {/* Corner Brackets */}
                    <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />
                  </div>
                </>
              )}
            </div>
            
            {/* Status Indicators */}
            <div className="absolute top-4 left-4 flex space-x-2">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${isScanning ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                <span>{isScanning ? 'Live Feed' : 'Offline'}</span>
              </div>
              {isModelLoaded && (
                <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase tracking-tighter">
                  AI Ready
                </div>
              )}
            </div>
          </div>

          {/* Data Panel */}
          <div className="flex flex-col space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex-1">
              <div className="flex items-center space-x-2 mb-6 text-cyan-400">
                <Zap className="w-5 h-5" />
                <h2 className="text-xs font-bold uppercase tracking-widest">Análise de Humor</h2>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEmotion || 'none'}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mb-8"
                >
                  <span className="text-xs text-gray-400 font-mono uppercase block mb-1">Detectado:</span>
                  <span className="text-5xl font-black tracking-tighter uppercase italic text-white">
                    {currentEmotion ? emotionTranslations[currentEmotion] : '---'}
                  </span>
                </motion.div>
              </AnimatePresence>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  <span>Sinal Neural</span>
                  <span>98.2%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: isScanning ? '98.2%' : '0%' }}
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-xl shadow-purple-900/20 relative overflow-hidden">
              <Sparkles className="absolute top-[-10px] right-[-10px] w-24 h-24 text-white/10 rotate-12" />
              <div className="flex items-center space-x-2 mb-4 text-white/80">
                <Heart className="w-4 h-4" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest">Mensagem de IA</h2>
              </div>
              
              <div className="min-h-[100px] flex items-center">
                {isLoadingMessage ? (
                  <div className="flex space-x-1">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-white rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full" />
                  </div>
                ) : (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-medium leading-tight text-white italic"
                  >
                    "{message}"
                  </motion.p>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">
          <span>© 2026 Emotion AI Systems</span>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="w-1 h-1 bg-cyan-400 rounded-full" />
              <span>Secure Link</span>
            </span>
            <span>Encrypted Feed</span>
          </div>
        </footer>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
      `}} />
    </div>
  );
}
