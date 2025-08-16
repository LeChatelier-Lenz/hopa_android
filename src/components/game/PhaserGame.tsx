import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { LoadingScene } from './scenes/LoadingScene';
import { BattleScene } from './scenes/BattleScene';
import { VictoryScene } from './scenes/VictoryScene';
import { Box, Typography } from '@mui/material';

interface PhaserGameProps {
  onGameEvent?: (event: string, data?: any) => void;
  gameData?: {
    player1Config: any;
    player2Config: any;
    monsters: any[];
    backgroundUrl?: string | null;
    consensusTheme?: {
      title: string;
      description: string;
    };
  };
}

const PhaserGame: React.FC<PhaserGameProps> = ({ onGameEvent, gameData }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    try {
      // 获取窗口尺寸
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Phaser游戏配置 - 全屏移动端优化
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: windowWidth,
        height: windowHeight,
        parent: gameRef.current,
        backgroundColor: '#87CEEB', // 天空蓝背景
        scene: [LoadingScene, BattleScene, VictoryScene], // 从LoadingScene开始
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 }, // 关闭重力，适合回合制RPG
            debug: false,
          },
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: windowWidth,
          height: windowHeight,
        },
        render: {
          antialias: true,
          pixelArt: false,
        },
      };

      // 创建Phaser游戏实例
      phaserGameRef.current = new Phaser.Game(config);

      // 游戏加载完成后的回调
      phaserGameRef.current.events.once('ready', () => {
        setIsLoading(false);
        console.log('Phaser game initialized successfully');
        
        // 传递游戏数据到场景
        if (gameData && phaserGameRef.current) {
          const loadingScene = phaserGameRef.current.scene.getScene('LoadingScene') as LoadingScene;
          if (loadingScene) {
            loadingScene.setGameData(gameData);
          }

          const battleScene = phaserGameRef.current.scene.getScene('BattleScene') as BattleScene;
          if (battleScene) {
            battleScene.setGameData(gameData);
          }
        }

        // 设置游戏事件监听
        if (onGameEvent && phaserGameRef.current) {
          const loadingScene = phaserGameRef.current.scene.getScene('LoadingScene') as LoadingScene;
          if (loadingScene) {
            loadingScene.setEventCallback(onGameEvent);
          }

          const battleScene = phaserGameRef.current.scene.getScene('BattleScene') as BattleScene;
          if (battleScene) {
            battleScene.setEventCallback(onGameEvent);
          }
          
          const victoryScene = phaserGameRef.current.scene.getScene('VictoryScene') as VictoryScene;
          if (victoryScene) {
            victoryScene.setEventCallback(onGameEvent);
          }
        }

        // 启动LoadingScene
        if (phaserGameRef.current) {
          phaserGameRef.current.scene.start('LoadingScene', { gameData });
        }
      });

    } catch (error) {
      console.error('Failed to initialize Phaser game:', error);
      setError('游戏初始化失败，请刷新页面重试');
      setIsLoading(false);
    }

    // 清理函数
    return () => {
      if (phaserGameRef.current) {
        console.log('Destroying Phaser game instance');
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, [onGameEvent, gameData]);

  // 窗口大小改变时调整游戏尺寸
  useEffect(() => {
    const handleResize = () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.scale.refresh();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          width: 800,
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          border: '2px solid #ff5a5e',
          mx: 'auto',
        }}
      >
        <Typography variant="h6" color="error" gutterBottom>
          ⚠️ {error}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          检查控制台获取更多错误信息
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            zIndex: 10,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#ff5a5e' }}>
            🎮 游戏加载中...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            正在初始化共识征程战斗场景
          </Typography>
        </Box>
      )}
      
      <div
        ref={gameRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      />
    </Box>
  );
};

export default PhaserGame;