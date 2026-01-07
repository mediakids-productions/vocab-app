// MK Vocab - Speech Module
// Handles Web Speech API for pronunciation

const Speech = {
    synth: window.speechSynthesis,
    voice: null,
    rate: 0.9,

    // Initialize and find English voice
    init() {
        const settings = Storage.getSettings();
        this.rate = settings.speechRate || 0.9;

        // Load voices
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.loadVoice();
        }
        this.loadVoice();
    },

    // Load English voice
    loadVoice() {
        const voices = this.synth.getVoices();
        // Prefer US English voices
        this.voice = voices.find(v => v.lang === 'en-US') ||
            voices.find(v => v.lang.startsWith('en')) ||
            voices[0];
    },

    // Speak a word
    speak(text) {
        // Cancel any ongoing speech
        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = this.rate;
        utterance.pitch = 1;

        if (this.voice) {
            utterance.voice = this.voice;
        }

        this.synth.speak(utterance);
    },

    // Set speech rate
    setRate(rate) {
        this.rate = rate;
        Storage.updateSettings({ speechRate: rate });
    },

    // Get current rate
    getRate() {
        return this.rate;
    },

    // Stop speaking
    stop() {
        this.synth.cancel();
    },

    // Check if speaking
    isSpeaking() {
        return this.synth.speaking;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Speech.init();
});
