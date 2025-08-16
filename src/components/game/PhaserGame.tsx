import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { BattleScene } from './scenes/BattleScene';
import { VictoryScene } from './scenes/VictoryScene';
import { Box, Typography } from '@mui/material';

interface PhaserGameProps {
  onGameEvent?: (event: string, data?: any) => void;
  gameData?: {
    player1Config: any;
    player2Config: any;
    monsters: any[];
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
      // Phaser游戏配置
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameRef.current,
        backgroundColor: '#87CEEB', // 天空蓝背景
        scene: [BattleScene, VictoryScene],
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 }, // 关闭重力，适合回合制RPG
            debug: false,
          },
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 800,
          height: 600,
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
          const battleScene = phaserGameRef.current.scene.getScene('BattleScene') as BattleScene;
          if (battleScene) {
            battleScene.setGameData(gameData);
          }
        }

        // 设置游戏事件监听
        if (onGameEvent && phaserGameRef.current) {
          const battleScene = phaserGameRef.current.scene.getScene('BattleScene') as BattleScene;
          if (battleScene) {
            battleScene.setEventCallback(onGameEvent);
          }
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 600,
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
            正在初始化西湖约会战斗场景
          </Typography>
        </Box>
      )}
      
      <div
        ref={gameRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        }}
      />
    </Box>
  );
};

export default PhaserGame;