export default class AudioManager {
  static playStoneSound(player: 'black' | 'white') {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // 黑子較低頻，白子較高頻
      osc.type = 'sine';
      osc.frequency.value = player === 'black' ? 340 : 420;
      gain.gain.value = 0.12;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
      osc.onended = () => ctx.close();
    } catch {
      // 忽略音效錯誤
    }
  }
} 