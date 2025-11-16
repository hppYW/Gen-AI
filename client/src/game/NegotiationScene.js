import Phaser from 'phaser';

export default class NegotiationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'NegotiationScene' });
    this.emotionState = null;
    this.currentRapport = 50;
    this.messageCallback = null;
    this.scenario = null;
  }

  init(data) {
    console.log('🎮 Scene init called with data:', data);
    if (data && data.scenario) {
      this.scenario = data.scenario;
    }
  }

  preload() {
    console.log('🎮 Scene preload called');
    // 로딩 텍스트
    this.load.on('progress', (value) => {
      console.log('Loading:', Math.floor(value * 100) + '%');
    });
  }

  create(data) {
    console.log('🎮 Scene create called with data:', data);

    // data가 없으면 init에서 받은 scenario 사용
    if (data && data.scenario) {
      this.scenario = data.scenario;
    }

    if (!this.scenario) {
      console.error('❌ No scenario data available');
      return;
    }

    console.log('✅ Creating game with scenario:', this.scenario.title);

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // 배경 그라데이션
    this.add.rectangle(0, 0, width, height, 0x1e1e2e).setOrigin(0);

    // 상단 헤더
    this.createHeader(width);

    // NPC 캐릭터 영역
    this.createNPCArea(width, height);

    // 대화창 영역
    this.createDialogueBox(width, height);

    // 호감도 게이지
    this.createRapportGauge(width, height);

    // 입력 영역은 DOM으로 처리 (React 컴포넌트 재사용)
  }

  createHeader(width) {
    // 헤더 배경
    const headerBg = this.add.rectangle(width / 2, 40, width, 80, 0x667eea);

    // 시나리오 제목
    const title = this.add.text(width / 2, 40, this.scenario?.title || '협상 중', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
  }

  createNPCArea(width, height) {
    const centerX = width / 2;
    const npcY = height * 0.35;

    // NPC 플레이스홀더 (원형)
    this.npcCircle = this.add.circle(centerX, npcY, 80, 0x764ba2);
    this.npcCircle.setStrokeStyle(4, 0x667eea);

    // NPC 감정 이모지
    this.npcEmoji = this.add.text(centerX, npcY, '😐', {
      fontSize: '64px'
    }).setOrigin(0.5);

    // NPC 이름
    this.npcName = this.add.text(centerX, npcY + 100, this.scenario?.npcProfile?.role || 'NPC', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 펄스 애니메이션
    this.tweens.add({
      targets: this.npcCircle,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createDialogueBox(width, height) {
    const boxHeight = 180;
    const boxY = height - boxHeight - 100;

    // 대화창 배경
    const dialogueBg = this.add.rectangle(
      width / 2,
      boxY,
      width - 100,
      boxHeight,
      0x2d2d44,
      0.95
    );
    dialogueBg.setStrokeStyle(2, 0x667eea);

    // 대화 텍스트
    this.dialogueText = this.add.text(
      80,
      boxY - boxHeight / 2 + 20,
      '',
      {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ffffff',
        wordWrap: { width: width - 160 }
      }
    );
  }

  createRapportGauge(width, height) {
    const gaugeY = height * 0.15;
    const gaugeWidth = 300;
    const gaugeHeight = 24;

    // 게이지 배경
    const gaugeBg = this.add.rectangle(
      width / 2,
      gaugeY,
      gaugeWidth,
      gaugeHeight,
      0x333333
    );

    // 게이지 채우기
    this.rapportFill = this.add.rectangle(
      width / 2 - gaugeWidth / 2,
      gaugeY,
      gaugeWidth * (this.currentRapport / 100),
      gaugeHeight,
      0x4ade80
    ).setOrigin(0, 0.5);

    // 호감도 텍스트
    this.rapportText = this.add.text(
      width / 2,
      gaugeY - 30,
      `호감도: ${this.currentRapport}/100`,
      {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);
  }

  updateDialogue(message) {
    // 타이핑 효과로 메시지 표시
    this.dialogueText.setText('');
    let charIndex = 0;

    this.time.addEvent({
      delay: 30,
      repeat: message.length - 1,
      callback: () => {
        this.dialogueText.setText(message.substring(0, charIndex + 1));
        charIndex++;
      }
    });
  }

  updateEmotion(emotionState) {
    if (!emotionState) return;

    this.emotionState = emotionState;
    this.currentRapport = emotionState.rapport || 50;

    // 이모지 업데이트
    const emotionEmojis = {
      happy: '😊',
      neutral: '😐',
      concerned: '😟',
      frustrated: '😤',
      angry: '😠'
    };
    this.npcEmoji.setText(emotionEmojis[emotionState.emotion] || '😐');

    // 호감도 게이지 애니메이션
    const gaugeWidth = 300;
    this.tweens.add({
      targets: this.rapportFill,
      width: gaugeWidth * (this.currentRapport / 100),
      duration: 500,
      ease: 'Power2'
    });

    // 호감도 색상 변경
    let color = 0x4ade80; // green
    if (this.currentRapport < 25) color = 0xef4444; // red
    else if (this.currentRapport < 50) color = 0xfbbf24; // yellow
    else if (this.currentRapport < 75) color = 0x60a5fa; // blue

    this.rapportFill.setFillStyle(color);
    this.rapportText.setText(`호감도: ${this.currentRapport}/100`);

    // NPC 원 색상 변경
    this.npcCircle.setStrokeStyle(4, color);
  }

  update() {
    // 게임 루프 (필요시 사용)
  }
}
