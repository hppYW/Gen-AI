/**
 * Sound Manager for generating and playing UI sounds
 * Uses Web Audio API to generate simple sound effects
 */
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.3;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Play a simple beep sound
   */
  playBeep(frequency = 440, duration = 0.1, volume = 1.0) {
    if (!this.enabled) return;
    this.init();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(this.masterVolume * volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Play message send sound
   */
  playMessageSend() {
    this.playBeep(600, 0.08, 0.4);
  }

  /**
   * Play message receive sound
   */
  playMessageReceive() {
    this.playBeep(400, 0.1, 0.3);
    setTimeout(() => this.playBeep(500, 0.08, 0.25), 50);
  }

  /**
   * Play button click sound
   */
  playButtonClick() {
    this.playBeep(800, 0.05, 0.3);
  }

  /**
   * Play rapport increase sound (positive)
   */
  playRapportIncrease() {
    this.playBeep(523, 0.1, 0.35); // C5
    setTimeout(() => this.playBeep(659, 0.1, 0.35), 80); // E5
    setTimeout(() => this.playBeep(784, 0.15, 0.4), 160); // G5
  }

  /**
   * Play rapport decrease sound (negative)
   */
  playRapportDecrease() {
    this.playBeep(500, 0.1, 0.35);
    setTimeout(() => this.playBeep(400, 0.1, 0.35), 80);
    setTimeout(() => this.playBeep(300, 0.15, 0.4), 160);
  }

  /**
   * Play achievement unlock sound
   */
  playAchievement() {
    this.playBeep(523, 0.1, 0.4); // C
    setTimeout(() => this.playBeep(659, 0.1, 0.4), 100); // E
    setTimeout(() => this.playBeep(784, 0.1, 0.4), 200); // G
    setTimeout(() => this.playBeep(1047, 0.3, 0.5), 300); // C (octave higher)
  }

  /**
   * Play error/warning sound
   */
  playError() {
    this.playBeep(200, 0.15, 0.4);
    setTimeout(() => this.playBeep(180, 0.2, 0.4), 100);
  }

  /**
   * Play success sound
   */
  playSuccess() {
    this.playBeep(659, 0.1, 0.4);
    setTimeout(() => this.playBeep(784, 0.15, 0.45), 120);
  }

  /**
   * Play hover sound (subtle)
   */
  playHover() {
    this.playBeep(1000, 0.03, 0.15);
  }

  /**
   * Play notification sound
   */
  playNotification() {
    this.playBeep(800, 0.08, 0.35);
    setTimeout(() => this.playBeep(1000, 0.12, 0.35), 100);
  }
}

// Export singleton instance
const soundManager = new SoundManager();
export default soundManager;
