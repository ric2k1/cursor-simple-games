interface AudioSequence {
    sounds: string[];
    volumes?: number[];
    delays?: number[];
}

interface AudioConfig {
    volume: number;
    loop: boolean;
    fade?: {
        in?: number;
        out?: number;
    };
}

export default class AudioManager {
  private backgroundMusic: HTMLAudioElement | null = null;

  private soundCache: Map<string, HTMLAudioElement> = new Map();

  private isEnabled: boolean = true;

  private masterVolume: number = 0.3;

  private backgroundMusicVolume: number = 0.15;

  private sequenceTimeouts: NodeJS.Timeout[] = [];

  constructor() {
    this.preloadSounds();
    this.setupBackgroundMusic();
  }

  private preloadSounds(): void {
    const soundFiles = [
      'shoot', 'enemyshoot', 'enemyhit', 'playerhit', 'explosion', 'gameover',
      'laser1', 'laser2', 'laser3', 'laser4', 'laser5', 'laser6', 'laser7', 'laser8', 'laser9',
      'zap1', 'zap2', 'zapThreeToneDown', 'zapThreeToneUp', 'zapTwoTone', 'zapTwoTone2',
      'threeTone1', 'threeTone2', 'tone1', 'twoTone1', 'twoTone2',
      'highDown', 'highUp', 'lowDown', 'lowRandom', 'lowThreeTone',
      'pepSound1', 'pepSound2', 'pepSound3', 'pepSound4', 'pepSound5',
      'phaseJump1', 'phaseJump2', 'phaseJump3', 'phaseJump4', 'phaseJump5',
      'phaserDown1', 'phaserDown2', 'phaserDown3',
      'phaserUp1', 'phaserUp2', 'phaserUp3', 'phaserUp4', 'phaserUp5', 'phaserUp6', 'phaserUp7',
      'powerUp1', 'powerUp2', 'powerUp3', 'powerUp4', 'powerUp5', 'powerUp6', 'powerUp7', 'powerUp8', 'powerUp9', 'powerUp10', 'powerUp11', 'powerUp12',
      'spaceTrash1', 'spaceTrash2', 'spaceTrash3', 'spaceTrash4', 'spaceTrash5',
    ];

    soundFiles.forEach((soundName) => {
      const audio = new Audio(`/${soundName}.mp3`);
      audio.volume = this.masterVolume;
      audio.preload = 'auto';
      this.soundCache.set(soundName, audio);
    });
  }

  private setupBackgroundMusic(): void {
    // 使用多個音效組合創建背景音樂循環
    this.createBackgroundMusicLoop();
  }

  private createBackgroundMusicLoop(): void {
    if (!this.isEnabled) return;

    const backgroundSounds = [
      'lowThreeTone', 'spaceTrash1', 'phaserUp1', 'spaceTrash2',
      'tone1', 'spaceTrash3', 'phaserDown1', 'spaceTrash4',
    ];

    let currentIndex = 0;
    const playNext = () => {
      if (!this.isEnabled) return;

      const soundName = backgroundSounds[currentIndex];
      const audio = this.soundCache.get(soundName);

      if (audio) {
        audio.volume = this.backgroundMusicVolume;
        audio.play().catch(() => {
          // 背景音效播放失敗
        });

        audio.onended = () => {
          currentIndex = (currentIndex + 1) % backgroundSounds.length;
          setTimeout(playNext, 1000); // 1秒間隔後播放下一個
        };
      }
    };

    playNext();
  }

  public playSound(soundName: string, config?: AudioConfig): void {
    if (!this.isEnabled) return;

    const audio = this.soundCache.get(soundName);
    if (!audio) {
      // 音效不存在
      return;
    }

    // 重置音效到開始位置
    audio.currentTime = 0;
    audio.volume = (config?.volume || this.masterVolume);
    audio.loop = config?.loop || false;

    audio.play().catch(() => {
      // 音效播放失敗
    });
  }

  public playSequence(sequence: AudioSequence): void {
    if (!this.isEnabled) return;

    // 清除之前的序列
    this.clearSequenceTimeouts();

    let totalDelay = 0;

    sequence.sounds.forEach((soundName, index) => {
      const delay = sequence.delays?.[index] || 0;
      const volume = sequence.volumes?.[index] || this.masterVolume;

      totalDelay += delay;

      const timeoutId = setTimeout(() => {
        this.playSound(soundName, { volume, loop: false });
      }, totalDelay);

      this.sequenceTimeouts.push(timeoutId);
    });
  }

  private clearSequenceTimeouts(): void {
    this.sequenceTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.sequenceTimeouts = [];
  }

  // 遊戲專用的音效序列
  public playPlayerShoot(): void {
    this.playSequence({
      sounds: ['laser1', 'zap1'],
      volumes: [0.2, 0.3],
      delays: [0, 100],
    });
  }

  public playEnemyShoot(): void {
    this.playSequence({
      sounds: ['phaserDown1', 'lowDown'],
      volumes: [0.25, 0.2],
      delays: [0, 150],
    });
  }

  public playEnemyHit(): void {
    this.playSequence({
      sounds: ['zapThreeToneDown', 'pepSound1', 'highDown'],
      volumes: [0.4, 0.3, 0.2],
      delays: [0, 200, 400],
    });
  }

  public playPlayerHit(): void {
    this.playSequence({
      sounds: ['zapTwoTone', 'phaserDown3', 'lowRandom'],
      volumes: [0.5, 0.4, 0.3],
      delays: [0, 300, 600],
    });
  }

  public playExplosion(): void {
    this.playSequence({
      sounds: ['threeTone1', 'spaceTrash1', 'zapThreeToneUp'],
      volumes: [0.6, 0.4, 0.3],
      delays: [0, 200, 500],
    });
  }

  public playGameOver(): void {
    this.playSequence({
      sounds: ['phaserDown1', 'phaserDown2', 'phaserDown3', 'lowThreeTone'],
      volumes: [0.5, 0.4, 0.3, 0.2],
      delays: [0, 500, 1000, 1500],
    });
  }

  public playLevelComplete(): void {
    this.playSequence({
      sounds: ['powerUp1', 'powerUp2', 'powerUp3', 'phaserUp1', 'phaserUp2'],
      volumes: [0.4, 0.4, 0.4, 0.3, 0.3],
      delays: [0, 200, 400, 600, 800],
    });
  }

  public playGameStart(): void {
    this.playSequence({
      sounds: ['phaseJump1', 'phaserUp4', 'powerUp12'],
      volumes: [0.4, 0.3, 0.3],
      delays: [0, 300, 600],
    });
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
      this.clearSequenceTimeouts();
    } else {
      this.setupBackgroundMusic();
    }
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  public setBackgroundMusicVolume(volume: number): void {
    this.backgroundMusicVolume = Math.max(0, Math.min(1, volume));
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  public stopAllSounds(): void {
    this.soundCache.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.clearSequenceTimeouts();
  }
}
