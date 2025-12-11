import Phaser from 'phaser';
import soundManager from '../services/soundManager';

export default class VisualNovelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VisualNovelScene' });
    this.scenario = null;
    this.emotionState = null;
    this.currentRapport = 50;
    this.inputCallback = null;
    this.messageHistory = [];
    this.historyTextObjects = [];
    this.historyScrollY = 0;
  }

  init(data) {
    console.log('🎮 Visual Novel Scene init:', data);
    if (data) {
      this.scenario = data.scenario;
      this.inputCallback = data.onInput;
    }
  }

  preload() {
    // 배경 이미지 로드
    if (this.scenario?.background?.image) {
      console.log('🖼️ Loading background:', this.scenario.background.image);
      this.load.image('background', this.scenario.background.image);
    }
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    console.log('🎮 Creating RPG Dialogue Scene:', width, 'x', height);

    // 1. 배경 이미지
    this.createBackground(width, height);

    // 2. NPC 캐릭터 영역 (중앙 상단)
    this.createNPCArea(width, height);

    // 3. 하단 대화창
    this.createDialogueBox(width, height);

    // 4. 좌측 상단 스탯 패널
    this.createStatsPanel();

    // 5. 우측 대화 기록 패널
    this.createHistoryPanel(width, height);

    // 6. 입력 버튼
    this.createInputButton(width, height);

    // Emit create event when done
    this.events.emit('create');
  }

  createBackground(width, height) {
    // 배경 이미지가 있으면 표시
    if (this.textures.exists('background')) {
      const bgImage = this.add.image(width / 2, height / 2, 'background');

      // 화면에 꽉 차도록 스케일 조정
      const scaleX = width / bgImage.width;
      const scaleY = height / bgImage.height;
      const scale = Math.max(scaleX, scaleY);
      bgImage.setScale(scale);

      // 어두운 오버레이
      const overlay = this.add.graphics();
      overlay.fillStyle(0x000000, 0.4);
      overlay.fillRect(0, 0, width, height);
    } else {
      // 기본 그라데이션 배경
      const bg = this.add.graphics();
      bg.fillGradientStyle(0x0a0a1e, 0x0a0a1e, 0x1a1a3e, 0x1a1a3e, 1, 1, 1, 1);
      bg.fillRect(0, 0, width, height);
    }
  }

  createNPCArea(width, height) {
    const npcAreaY = height * 0.3;

    // NPC 이름 배경
    const nameBg = this.add.graphics();
    nameBg.fillStyle(0x1e1e2e, 0.95);
    nameBg.fillRoundedRect(width / 2 - 150, npcAreaY - 50, 300, 50, 10);
    nameBg.lineStyle(2, 0x667eea, 1);
    nameBg.strokeRoundedRect(width / 2 - 150, npcAreaY - 50, 300, 50, 10);

    // NPC 이름
    this.npcNameText = this.add.text(
      width / 2,
      npcAreaY - 25,
      this.scenario?.npcProfile?.role || 'NPC',
      {
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#667eea',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // NPC 설명
    this.npcRoleText = this.add.text(
      width / 2,
      npcAreaY + 20,
      this.scenario?.npcProfile?.personality || '',
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        alpha: 0.8
      }
    ).setOrigin(0.5);
  }

  createDialogueBox(width, height) {
    const boxHeight = 220;
    const boxY = height - boxHeight - 20;
    const boxPadding = 40;

    // 대화창 배경
    const dialogueBg = this.add.graphics();
    dialogueBg.fillStyle(0x1e1e2e, 0.95);
    dialogueBg.fillRoundedRect(boxPadding, boxY, width - boxPadding * 2, boxHeight, 12);

    // 테두리
    dialogueBg.lineStyle(3, 0x667eea, 1);
    dialogueBg.strokeRoundedRect(boxPadding, boxY, width - boxPadding * 2, boxHeight, 12);

    // 말하는 사람 표시
    this.speakerNameBg = this.add.graphics();
    this.speakerNameBg.fillStyle(0x667eea, 1);
    this.speakerNameBg.fillRoundedRect(boxPadding + 20, boxY - 20, 120, 40, 8);

    this.speakerName = this.add.text(
      boxPadding + 80,
      boxY,
      'NPC',
      {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // 대화 텍스트 영역 계산
    const textAreaWidth = width - boxPadding * 2 - 60;
    const textAreaHeight = boxHeight - 70;

    // 대화 텍스트
    this.dialogueText = this.add.text(
      boxPadding + 30,
      boxY + 25,
      '대화를 시작하세요...',
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        wordWrap: { width: textAreaWidth, useAdvancedWrap: true },
        lineSpacing: 6,
        align: 'left',
        maxLines: 6
      }
    );

    // 계속하기 표시
    this.continueArrow = this.add.text(
      width - boxPadding - 30,
      boxY + boxHeight - 30,
      '▼',
      {
        fontSize: '20px',
        color: '#667eea'
      }
    ).setOrigin(1, 0.5);

    // 화살표 애니메이션
    this.tweens.add({
      targets: this.continueArrow,
      y: this.continueArrow.y + 5,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createStatsPanel() {
    const panelX = 20;
    const panelY = 20;
    const panelWidth = 280;
    const panelHeight = 140;

    // 스탯 패널 배경
    const statsBg = this.add.graphics();
    statsBg.fillStyle(0x1e1e2e, 0.9);
    statsBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 10);
    statsBg.lineStyle(2, 0x667eea, 1);
    statsBg.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 10);

    // 시나리오 제목
    this.add.text(
      panelX + 15,
      panelY + 15,
      this.scenario?.title || '협상 중',
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    );

    // 구분선
    const divider = this.add.graphics();
    divider.lineStyle(1, 0x667eea, 0.5);
    divider.lineBetween(panelX + 15, panelY + 40, panelX + panelWidth - 15, panelY + 40);

    // 호감도 라벨
    this.add.text(panelX + 15, panelY + 50, '💗 호감도', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff'
    });

    // 호감도 바 배경
    const gaugeX = panelX + 15;
    const gaugeY = panelY + 75;
    const gaugeWidth = panelWidth - 80;

    this.add.rectangle(gaugeX, gaugeY, gaugeWidth, 16, 0x2d2d44).setOrigin(0, 0.5);

    // 호감도 바 채우기
    this.rapportFill = this.add.rectangle(
      gaugeX,
      gaugeY,
      gaugeWidth * (this.currentRapport / 100),
      16,
      0x4ade80
    ).setOrigin(0, 0.5);

    // 호감도 수치
    this.rapportText = this.add.text(
      panelX + panelWidth - 15,
      gaugeY,
      `${this.currentRapport}%`,
      {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(1, 0.5);

    // 감정 상태
    this.emotionLabel = this.add.text(
      panelX + 15,
      panelY + 100,
      '😐 중립',
      {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff'
      }
    );
  }

  createHistoryPanel(width, height) {
    const panelWidth = 350;
    const panelHeight = 500;
    const panelX = width - panelWidth - 20;
    const panelY = 20;

    // 대화 기록 패널 배경
    const historyBg = this.add.graphics();
    historyBg.fillStyle(0x1e1e2e, 0.92);
    historyBg.fillRoundedRect(panelX, panelY, panelWidth, panelHeight, 10);
    historyBg.lineStyle(2, 0x667eea, 1);
    historyBg.strokeRoundedRect(panelX, panelY, panelWidth, panelHeight, 10);

    // 헤더
    this.add.text(
      panelX + 15,
      panelY + 15,
      '📜 대화 기록',
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    );

    // 구분선
    const divider = this.add.graphics();
    divider.lineStyle(1, 0x667eea, 0.5);
    divider.lineBetween(panelX + 15, panelY + 40, panelX + panelWidth - 15, panelY + 40);

    // 대화 기록 컨테이너 (스크롤 가능한 영역)
    this.historyContainer = this.add.container(0, 0);
    this.historyContentY = panelY + 50;
    this.historyMaxHeight = panelHeight - 70;
    this.historyPanelX = panelX;
    this.historyPanelWidth = panelWidth;

    // 마스크 설정 (스크롤 영역 제한)
    const maskShape = this.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(panelX + 10, panelY + 50, panelWidth - 20, panelHeight - 60);
    const mask = maskShape.createGeometryMask();
    this.historyContainer.setMask(mask);

    // 스크롤 바 배경
    const scrollBarBg = this.add.rectangle(
      panelX + panelWidth - 10,
      panelY + 50,
      6,
      panelHeight - 60,
      0x2d2d44,
      0.5
    ).setOrigin(0.5, 0);

    // 스크롤 바
    this.scrollBar = this.add.rectangle(
      panelX + panelWidth - 10,
      panelY + 50,
      6,
      100,
      0x667eea,
      0.8
    ).setOrigin(0.5, 0);

    // 스크롤 안내 텍스트
    this.historyEmptyText = this.add.text(
      panelX + panelWidth / 2,
      panelY + panelHeight / 2,
      '대화를 시작하면\n기록이 여기에 표시됩니다',
      {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        alpha: 0.5,
        align: 'center'
      }
    ).setOrigin(0.5);

    // 마우스 휠 스크롤 이벤트
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      // 마우스가 패널 영역 안에 있을 때만 스크롤
      if (pointer.x >= panelX && pointer.x <= panelX + panelWidth &&
          pointer.y >= panelY && pointer.y <= panelY + panelHeight) {
        this.scrollHistory(deltaY);
      }
    });
  }

  scrollHistory(delta) {
    const scrollSpeed = 30;
    this.historyScrollY += delta > 0 ? scrollSpeed : -scrollSpeed;

    // 스크롤 범위 제한
    const maxScroll = Math.max(0, this.historyTotalHeight - this.historyMaxHeight);
    this.historyScrollY = Phaser.Math.Clamp(this.historyScrollY, 0, maxScroll);

    // 컨테이너 위치 업데이트
    this.updateHistoryPosition();
  }

  updateHistoryPosition() {
    if (!this.historyContainer) return;

    this.historyContainer.y = this.historyContentY - this.historyScrollY;

    // 스크롤 바 위치 업데이트
    if (this.scrollBar && this.historyTotalHeight > this.historyMaxHeight) {
      const scrollRatio = this.historyScrollY / (this.historyTotalHeight - this.historyMaxHeight);
      const scrollBarMaxY = this.historyMaxHeight - this.scrollBar.height;
      this.scrollBar.y = this.historyContentY + scrollBarMaxY * scrollRatio;
    }
  }

  createInputButton(width, height) {
    const buttonWidth = 300;
    const buttonHeight = 60;
    const buttonX = width - buttonWidth - 40;
    const buttonY = height - 310; // 대화창 위

    // 버튼 배경
    this.inputButtonBg = this.add.graphics();
    this.drawButton(this.inputButtonBg, buttonX, buttonY, buttonWidth, buttonHeight, false);

    // 클릭 영역
    const clickZone = this.add.rectangle(
      buttonX + buttonWidth / 2,
      buttonY + buttonHeight / 2,
      buttonWidth,
      buttonHeight,
      0x000000,
      0
    );
    clickZone.setInteractive({ useHandCursor: true });
    clickZone.on('pointerdown', () => {
      soundManager.playButtonClick();
      this.openInputModal();
    });

    // 버튼 텍스트
    this.inputButtonText = this.add.text(
      buttonX + buttonWidth / 2,
      buttonY + buttonHeight / 2,
      '💬 메시지 입력',
      {
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // 호버 효과
    clickZone.on('pointerover', () => {
      soundManager.playHover();
      this.inputButtonBg.clear();
      this.drawButton(this.inputButtonBg, buttonX, buttonY, buttonWidth, buttonHeight, true);
      this.tweens.add({
        targets: this.inputButtonText,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        ease: 'Back.easeOut'
      });
    });

    clickZone.on('pointerout', () => {
      this.inputButtonBg.clear();
      this.drawButton(this.inputButtonBg, buttonX, buttonY, buttonWidth, buttonHeight, false);
      this.tweens.add({
        targets: this.inputButtonText,
        scaleX: 1,
        scaleY: 1,
        duration: 150
      });
    });
  }

  drawButton(graphics, x, y, width, height, hover) {
    if (hover) {
      graphics.fillStyle(0x667eea, 1);
      graphics.fillRoundedRect(x, y, width, height, 10);
      graphics.lineStyle(3, 0xffffff, 1);
      graphics.strokeRoundedRect(x, y, width, height, 10);
    } else {
      graphics.fillStyle(0x2d2d44, 0.95);
      graphics.fillRoundedRect(x, y, width, height, 10);
      graphics.lineStyle(2, 0x667eea, 1);
      graphics.strokeRoundedRect(x, y, width, height, 10);
    }
  }

  openInputModal() {
    if (this.inputCallback) {
      this.inputCallback();
    }
  }

  updateDialogue(message, speaker = 'NPC') {
    console.log('🎮 [VisualNovelScene] updateDialogue called');
    console.log('  Speaker:', speaker);
    console.log('  Message:', message.substring(0, 50) + '...');

    if (!this.speakerName || !this.dialogueText) {
      console.error('❌ Speaker or dialogue text object not found!');
      return;
    }

    // Play sound effect based on speaker
    if (speaker === 'NPC') {
      soundManager.playMessageReceive();
    }

    this.speakerName.setText(speaker);
    this.dialogueText.setText('');

    // 타이핑 애니메이션
    let charIndex = 0;
    const typingSpeed = 30;

    if (this.typingTimer) {
      this.typingTimer.remove();
    }

    this.typingTimer = this.time.addEvent({
      delay: typingSpeed,
      repeat: message.length - 1,
      callback: () => {
        this.dialogueText.setText(message.substring(0, charIndex + 1));
        charIndex++;
      }
    });

    console.log('✅ [VisualNovelScene] Dialogue updated, typing animation started');
  }

  updateEmotion(emotionState) {
    if (!emotionState) return;

    // Safety check: ensure all required text objects exist
    if (!this.rapportText || !this.emotionLabel || !this.rapportFill) {
      console.warn('⚠️ Scene not fully initialized yet, skipping emotion update');
      return;
    }

    this.emotionState = emotionState;
    const oldRapport = this.currentRapport;
    this.currentRapport = emotionState.rapport || 50;

    // 감정 이모지 매핑
    const emotionEmojis = {
      happy: '😊',
      neutral: '😐',
      concerned: '😟',
      frustrated: '😤',
      angry: '😠'
    };

    const emotionNames = {
      happy: '기쁨',
      neutral: '중립',
      concerned: '우려',
      frustrated: '불만',
      angry: '화남'
    };

    // 호감도에 따른 색상
    let color = 0x4ade80; // 초록
    if (this.currentRapport >= 75) color = 0x22c55e; // 진한 초록
    else if (this.currentRapport >= 50) color = 0x60a5fa; // 파랑
    else if (this.currentRapport >= 25) color = 0xfbbf24; // 노랑
    else color = 0xef4444; // 빨강

    // 호감도 바 애니메이션
    const gaugeWidth = 280 - 80;
    this.tweens.add({
      targets: this.rapportFill,
      width: gaugeWidth * (this.currentRapport / 100),
      fillColor: color,
      duration: 600,
      ease: 'Power2'
    });

    this.rapportText.setText(`${this.currentRapport}%`);

    const emoji = emotionEmojis[emotionState.emotion] || '😐';
    const emotionName = emotionNames[emotionState.emotion] || '중립';
    this.emotionLabel.setText(`${emoji} ${emotionName}`);

    // 호감도 변화 표시
    if (oldRapport !== this.currentRapport) {
      // Play sound based on rapport change
      const rapportChange = this.currentRapport - oldRapport;
      if (rapportChange > 0) {
        soundManager.playRapportIncrease();
      } else if (rapportChange < 0) {
        soundManager.playRapportDecrease();
      }
      const change = this.currentRapport - oldRapport;
      const changeText = this.add.text(
        this.cameras.main.width / 2,
        this.cameras.main.height * 0.5,
        change > 0 ? `+${change}` : `${change}`,
        {
          fontSize: '48px',
          fontFamily: 'Arial, sans-serif',
          color: change > 0 ? '#4ade80' : '#ef4444',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 4
        }
      ).setOrigin(0.5);

      this.tweens.add({
        targets: changeText,
        y: changeText.y - 80,
        alpha: 0,
        duration: 1200,
        ease: 'Power2',
        onComplete: () => changeText.destroy()
      });
    }
  }

  showLoading() {
    if (this.loadingText) return;

    this.loadingText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height * 0.5,
      '응답 대기 중...',
      {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        color: '#667eea',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }
    ).setOrigin(0.5);

    this.tweens.add({
      targets: this.loadingText,
      alpha: 0.4,
      duration: 700,
      yoyo: true,
      repeat: -1
    });
  }

  hideLoading() {
    if (this.loadingText) {
      this.loadingText.destroy();
      this.loadingText = null;
    }
  }

  updateMessageHistory(messages) {
    if (!this.historyContainer) return;

    console.log('📜 Updating message history:', messages.length, 'messages');

    // 기존 텍스트 객체 제거
    this.historyTextObjects.forEach(obj => obj.destroy());
    this.historyTextObjects = [];

    // 빈 메시지 텍스트 숨기기
    if (this.historyEmptyText) {
      this.historyEmptyText.setVisible(messages.length === 0);
    }

    if (messages.length === 0) return;

    const padding = 15;
    const messageSpacing = 10;
    let currentY = 0;

    messages.forEach((message, index) => {
      const isUser = message.role === 'user';
      const speaker = isUser ? '나' : (this.scenario?.npcProfile?.role || 'NPC');
      const speakerColor = isUser ? '#4ade80' : '#667eea';
      const textColor = '#ffffff';
      const bgColor = isUser ? 0x2d4436 : 0x2d2d44;

      // 메시지 배경
      const messageBg = this.add.graphics();
      const messageWidth = this.historyPanelWidth - padding * 2 - 20;

      // 임시로 텍스트 높이 계산
      const tempText = this.add.text(0, 0, message.content, {
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif',
        color: textColor,
        wordWrap: { width: messageWidth - 20 }
      });
      const textHeight = tempText.height;
      tempText.destroy();

      const messageHeight = textHeight + 35; // 여백 포함

      messageBg.fillStyle(bgColor, 0.7);
      messageBg.fillRoundedRect(
        this.historyPanelX + padding,
        currentY,
        messageWidth,
        messageHeight,
        6
      );

      // 말하는 사람
      const speakerText = this.add.text(
        this.historyPanelX + padding + 10,
        currentY + 8,
        speaker,
        {
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
          color: speakerColor,
          fontStyle: 'bold'
        }
      );

      // 메시지 내용
      const messageText = this.add.text(
        this.historyPanelX + padding + 10,
        currentY + 25,
        message.content,
        {
          fontSize: '13px',
          fontFamily: 'Arial, sans-serif',
          color: textColor,
          wordWrap: { width: messageWidth - 20 }
        }
      );

      this.historyContainer.add([messageBg, speakerText, messageText]);
      this.historyTextObjects.push(messageBg, speakerText, messageText);

      currentY += messageHeight + messageSpacing;
    });

    this.historyTotalHeight = currentY;

    // 스크롤바 크기 조정
    if (this.scrollBar) {
      const scrollBarHeight = Math.max(
        50,
        (this.historyMaxHeight / this.historyTotalHeight) * this.historyMaxHeight
      );
      this.scrollBar.setSize(6, scrollBarHeight);
      this.scrollBar.setVisible(this.historyTotalHeight > this.historyMaxHeight);
    }

    // 맨 아래로 자동 스크롤
    this.historyScrollY = Math.max(0, this.historyTotalHeight - this.historyMaxHeight);
    this.updateHistoryPosition();
  }
}
