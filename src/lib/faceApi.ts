import * as faceapi from 'face-api.js';

/**
 * URL base para os pesos (weights) dos modelos pré-treinados.
 * Esses modelos são essenciais para que o face-api.js saiba como detectar rostos e emoções.
 */
const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';

/**
 * Função para carregar os modelos necessários do face-api.js.
 * Carregamos o 'tinyFaceDetector' (detector de rostos leve) e o 'faceExpressionNet' (reconhecedor de emoções).
 */
export async function loadModels() {
  try {
    // Verifica se os modelos já foram carregados para evitar chamadas repetidas e lentidão
    if (faceapi.nets.tinyFaceDetector.params && faceapi.nets.faceExpressionNet.params) {
      return;
    }
    
    // Carrega os modelos de forma assíncrona a partir da URL do CDN
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
    console.log('Modelos de IA carregados com sucesso!');
  } catch (error) {
    console.error('Erro ao carregar modelos:', error);
    throw new Error('Falha ao carregar modelos de IA. Verifique sua conexão.');
  }
}

/**
 * Função que analisa um elemento de vídeo para encontrar um rosto e identificar a emoção predominante.
 * @param videoElement O elemento HTML <video> que contém o stream da câmera.
 */
export async function detectEmotion(videoElement: HTMLVideoElement) {
  if (!videoElement) return null;
  
  // Realiza a detecção de um único rosto e solicita o reconhecimento das expressões faciais
  // Usamos TinyFaceDetector por ser mais rápido em dispositivos com menos processamento
  const detection = await faceapi.detectSingleFace(
    videoElement,
    new faceapi.TinyFaceDetectorOptions()
  ).withFaceExpressions();
  
  if (!detection) return null;
  
  // O objeto 'expressions' contém probabilidades para cada emoção (happy, sad, etc.)
  const expressions = detection.expressions;
  // Ordenamos para encontrar a emoção com maior valor de probabilidade
  const sorted = Object.entries(expressions).sort(([, a], [, b]) => b - a);
  
  return {
    emotion: sorted[0][0], // Nome da emoção (ex: 'happy')
    probability: sorted[0][1], // Confiança da IA (ex: 0.99)
    allExpressions: expressions // Todas as outras emoções detectadas
  };
}

/**
 * Dicionário para traduzir os termos técnicos da IA para o português.
 */
export const emotionTranslations: Record<string, string> = {
  neutral: 'Neutro',
  happy: 'Feliz',
  sad: 'Triste',
  angry: 'Raivoso',
  fearful: 'Com Medo',
  disgusted: 'Nojo',
  surprised: 'Surpreso'
};
