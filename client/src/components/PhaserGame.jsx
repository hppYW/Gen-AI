import { useEffect, useRef, memo } from 'react';
import Phaser from 'phaser';
import VisualNovelScene from '../game/VisualNovelScene';
import './PhaserGame.css';

const PhaserGame = memo(({ scenario, onGameReady, onInput, width = 1400, height = 900 }) => {
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 이미 게임이 있으면 다시 생성하지 않음
    if (gameRef.current) {
      console.log('⚠️ Game already exists, skipping initialization');
      return;
    }

    console.log('🎮 Initializing Phaser game with scenario:', scenario.title);

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: width,
      height: height,
      backgroundColor: '#0a0a1e',
      scene: [VisualNovelScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      }
    };

    try {
      const game = new Phaser.Game(config);
      gameRef.current = game;

      console.log('✅ Phaser game created');

      // 씬 준비 대기
      setTimeout(() => {
        if (game.scene.scenes[0]) {
          const scene = game.scene.scenes[0];
          sceneRef.current = scene;
          console.log('✅ Scene reference set:', scene);

          // 시나리오 데이터를 씬에 전달하고 시작
          game.scene.start('VisualNovelScene', { scenario, onInput });

          // Scene의 create 이벤트를 기다림
          scene.events.once('create', () => {
            console.log('✅ Scene fully created and ready');
            if (onGameReady) {
              // create 완료 후 약간의 딜레이를 두고 onGameReady 호출
              setTimeout(() => {
                console.log('📢 Calling onGameReady with scene:', scene);
                onGameReady(scene);
              }, 100);
            }
          });
        }
      }, 100);
    } catch (error) {
      console.error('❌ Phaser initialization error:', error);
    }

    return () => {
      if (gameRef.current) {
        console.log('🎮 Destroying Phaser game');
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []); // 빈 배열로 변경 - 한 번만 초기화

  return (
    <div className="phaser-game-container">
      <div ref={containerRef} className="phaser-game" />
    </div>
  );
});

PhaserGame.displayName = 'PhaserGame';

export default PhaserGame;
