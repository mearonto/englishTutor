export function speakWord(word: string, contextSentence?: string, rate = 0.88): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  const voice = pickVoice(synth.getVoices());
  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = voice?.lang || "en-CA";
  utterance.rate = rate;
  utterance.pitch = 1;

  synth.speak(utterance);

  if (contextSentence) {
    const followUp = new SpeechSynthesisUtterance(contextSentence);
    if (voice) {
      followUp.voice = voice;
    }
    followUp.lang = voice?.lang || "en-CA";
    followUp.rate = Math.min(1.2, rate + 0.02);
    followUp.pitch = 1;
    synth.speak(followUp);
  }
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) {
    return null;
  }
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en-ca")) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
    voices[0]
  );
}
