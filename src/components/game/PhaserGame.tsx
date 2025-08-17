import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { LoadingScene } from './scenes/LoadingScene';
import { BattleScene } from './scenes/BattleScene';
import { VictoryScene } from './scenes/VictoryScene';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { Refresh, BugReport, Settings, Info } from '@mui/icons-material';

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
    maxParticipants?: number;
  };
}

const PhaserGame: React.FC<PhaserGameProps> = ({ onGameEvent, gameData }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [gameState, setGameState] = useState<string>('initializing');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [showConfigInfo, setShowConfigInfo] = useState(false);

  useEffect(() => {
    if (!gameRef.current) return;

    try {
      // 获取设备像素比例
      const pixelRatio = window.devicePixelRatio || 1;
      
      // 获取窗口尺寸
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // 高清渲染尺寸
      const renderWidth = windowWidth * pixelRatio;
      const renderHeight = windowHeight * pixelRatio;
      
      // Phaser游戏配置 - 高清移动端优化
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.WEBGL, // 强制使用WebGL以获得更好性能
        width: renderWidth,
        height: renderHeight,
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
          width: renderWidth,
          height: renderHeight,
        },
        render: {
          antialias: true,
          pixelArt: true,
          powerPreference: 'high-performance', // 使用高性能GPU
          transparent: false,
          clearBeforeRender: true,
          preserveDrawingBuffer: false,
          premultipliedAlpha: true,
          failIfMajorPerformanceCaveat: false,
          desynchronized: true, // 减少输入延迟
        },
        dom: {
          createContainer: true
        },
        // 高清渲染配置
        canvasStyle: `width: ${windowWidth}px; height: ${windowHeight}px;`
      };

      // 创建Phaser游戏实例
      phaserGameRef.current = new Phaser.Game(config);

      // 游戏加载完成后的回调
      phaserGameRef.current.events.once('ready', () => {
        setIsLoading(false);
        setGameState('ready');
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

  // 键盘快捷键支持
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // F5 强制刷新
      if (event.key === 'F5') {
        event.preventDefault();
        handleForceRefresh();
      }
      // Ctrl+Shift+D 切换调试模式
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        toggleDebugMode();
      }
      // Ctrl+R 刷新
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        handleForceRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // 实时更新调试信息
  useEffect(() => {
    if (!debugMode) return;

         const updateDebugInfo = () => {
       setDebugInfo({
         gameState,
         isLoading,
         hasError: !!error,
         gameStatus: getGameStatus(),
         performance: getPerformanceInfo(),
         timestamp: new Date().toLocaleTimeString(),
         refreshCount,
         gameData: gameData ? {
           hasTheme: !!gameData.consensusTheme,
           themeTitle: gameData.consensusTheme?.title,
           maxParticipants: gameData.maxParticipants,
         } : null
       });
     };

    // 立即更新一次
    updateDebugInfo();

    // 每秒更新一次
    const interval = setInterval(updateDebugInfo, 1000);
    return () => clearInterval(interval);
     }, [debugMode, gameState, isLoading, error, gameData, refreshCount]);

  // 强制刷新游戏 - 保持配置重新初始化
  const handleForceRefresh = () => {
    console.log('🔄 强制刷新游戏（保持配置）...');
    setRefreshCount(prev => prev + 1);
    setGameState('refreshing');
    setIsLoading(true);
    setError(null);
    
    // 销毁当前游戏实例
    if (phaserGameRef.current) {
      console.log('🗑️ 销毁当前游戏实例');
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    }
    
    // 重新初始化游戏 - 不重新加载页面，只重新创建Phaser实例
    setTimeout(() => {
      console.log('🔄 重新初始化Phaser游戏实例...');
      setGameState('initializing');
      
      // 手动触发游戏重新初始化
      if (gameRef.current) {
        try {
          // 获取设备像素比例
          const pixelRatio = window.devicePixelRatio || 1;
          
          // 获取窗口尺寸
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          
          // 高清渲染尺寸
          const renderWidth = windowWidth * pixelRatio;
          const renderHeight = windowHeight * pixelRatio;
          
          // Phaser游戏配置 - 高清移动端优化
          const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.WEBGL, // 强制使用WebGL以获得更好性能
            width: renderWidth,
            height: renderHeight,
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
              width: renderWidth,
              height: renderHeight,
            },
            render: {
              antialias: true,
              pixelArt: true,
              powerPreference: 'high-performance', // 使用高性能GPU
              transparent: false,
              clearBeforeRender: true,
              preserveDrawingBuffer: false,
              premultipliedAlpha: true,
              failIfMajorPerformanceCaveat: false,
              desynchronized: true, // 减少输入延迟
            },
            dom: {
              createContainer: true
            },
            // 高清渲染配置
            canvasStyle: `width: ${windowWidth}px; height: ${windowHeight}px;`
          };

          // 创建新的Phaser游戏实例
          phaserGameRef.current = new Phaser.Game(config);

          // 游戏加载完成后的回调
          phaserGameRef.current.events.once('ready', () => {
            setIsLoading(false);
            setGameState('ready');
            console.log('✅ Phaser游戏重新初始化成功');
            
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
          console.error('❌ 重新初始化Phaser游戏失败:', error);
          setError('游戏重新初始化失败，请手动刷新页面');
          setIsLoading(false);
        }
      }
    }, 200); // 稍微延长一点时间确保清理完成
  };

  // 切换调试模式
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    console.log(`🐛 调试模式: ${!debugMode ? '开启' : '关闭'}`);
  };

  // 显示配置信息
  const toggleConfigInfo = () => {
    setShowConfigInfo(!showConfigInfo);
    console.log(`📋 配置信息: ${!showConfigInfo ? '显示' : '隐藏'}`);
  };

  // 获取游戏状态信息
  const getGameStatus = () => {
    if (!phaserGameRef.current) return '游戏未初始化';
    
    const currentScene = phaserGameRef.current.scene.getScene('BattleScene') || 
                        phaserGameRef.current.scene.getScene('LoadingScene') || 
                        phaserGameRef.current.scene.getScene('VictoryScene');
    
    return currentScene ? `当前场景: ${currentScene.scene.key}` : '场景未加载';
  };

  // 获取性能信息
  const getPerformanceInfo = () => {
    if (!phaserGameRef.current) return null;
    
    const game = phaserGameRef.current;
    const fps = game.loop.actualFps;
    const delta = game.loop.delta;
    
    return {
      fps: Math.round(fps),
      delta: Math.round(delta),
      memory: (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024),
      } : null
    };
  };

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
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
      }}
    >
      {/* 调试工具栏 - 始终显示在右上角 */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          display: 'flex',
          gap: 1,
          flexDirection: 'column',
        }}
      >
        {/* 强制刷新按钮 */}
        <Tooltip title="重新初始化游戏（保持配置）(F5 / Ctrl+R)">
          <IconButton
            onClick={handleForceRefresh}
            sx={{
              bgcolor: 'rgba(255, 90, 94, 0.9)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 90, 94, 1)',
              },
              width: 40,
              height: 40,
            }}
          >
            <Refresh />
          </IconButton>
        </Tooltip>

                 {/* 调试模式切换 */}
         <Tooltip title={`${debugMode ? '关闭' : '开启'}调试模式 (Ctrl+Shift+D)`}>
           <IconButton
             onClick={toggleDebugMode}
             sx={{
               bgcolor: debugMode ? 'rgba(76, 175, 80, 0.9)' : 'rgba(158, 158, 158, 0.9)',
               color: 'white',
               '&:hover': {
                 bgcolor: debugMode ? 'rgba(76, 175, 80, 1)' : 'rgba(158, 158, 158, 1)',
               },
               width: 40,
               height: 40,
             }}
           >
             <BugReport />
           </IconButton>
         </Tooltip>

         {/* 配置信息显示 */}
         <Tooltip title={`${showConfigInfo ? '隐藏' : '显示'}配置信息`}>
           <IconButton
             onClick={toggleConfigInfo}
             sx={{
               bgcolor: showConfigInfo ? 'rgba(33, 150, 243, 0.9)' : 'rgba(158, 158, 158, 0.9)',
               color: 'white',
               '&:hover': {
                 bgcolor: showConfigInfo ? 'rgba(33, 150, 243, 1)' : 'rgba(158, 158, 158, 1)',
               },
               width: 40,
               height: 40,
             }}
           >
             <Info />
           </IconButton>
         </Tooltip>
      </Box>

      {/* 调试信息面板 - 仅在调试模式开启时显示 */}
      {debugMode && debugInfo && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1000,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            p: 2,
            borderRadius: 2,
            fontSize: '12px',
            fontFamily: 'monospace',
            maxWidth: 300,
          }}
        >
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
            🐛 调试信息 (实时)
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            状态: {debugInfo.gameState}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            加载: {debugInfo.isLoading ? '是' : '否'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            错误: {debugInfo.hasError ? '是' : '否'}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            游戏: {debugInfo.gameStatus}
          </Typography>
                     <Typography variant="body2" sx={{ mb: 0.5 }}>
             时间: {debugInfo.timestamp}
           </Typography>
           <Typography variant="body2" sx={{ mb: 0.5 }}>
             刷新: {debugInfo.refreshCount}次
           </Typography>
           {debugInfo.gameData && (
             <>
               <Typography variant="body2" sx={{ mb: 0.5 }}>
                 主题: {debugInfo.gameData.themeTitle || '无'}
               </Typography>
               <Typography variant="body2" sx={{ mb: 0.5 }}>
                 人数: {debugInfo.gameData.maxParticipants || 2}
               </Typography>
             </>
           )}
          {debugInfo.performance && (
            <>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                FPS: {debugInfo.performance.fps}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Delta: {debugInfo.performance.delta}ms
              </Typography>
              {debugInfo.performance.memory && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  内存: {debugInfo.performance.memory.used}MB / {debugInfo.performance.memory.total}MB
                </Typography>
              )}
            </>
          )}
        </Box>
             )}

       {/* 配置信息面板 - 仅在配置信息模式开启时显示 */}
       {showConfigInfo && gameData && (
         <Box
           sx={{
             position: 'absolute',
             top: 10,
             left: 320, // 在调试信息面板右侧
             zIndex: 1000,
             bgcolor: 'rgba(33, 150, 243, 0.9)',
             color: 'white',
             p: 2,
             borderRadius: 2,
             fontSize: '12px',
             fontFamily: 'monospace',
             maxWidth: 300,
           }}
         >
           <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
             📋 保持的配置信息
           </Typography>
           <Typography variant="body2" sx={{ mb: 0.5 }}>
             共识主题: {gameData.consensusTheme?.title || '无'}
           </Typography>
           <Typography variant="body2" sx={{ mb: 0.5 }}>
             主题描述: {gameData.consensusTheme?.description || '无'}
           </Typography>
           <Typography variant="body2" sx={{ mb: 0.5 }}>
             参与人数: {gameData.maxParticipants || 2}
           </Typography>
           <Typography variant="body2" sx={{ mb: 0.5 }}>
             背景图片: {gameData.backgroundUrl ? '已设置' : '无'}
           </Typography>
           {gameData.player1Config && (
             <Typography variant="body2" sx={{ mb: 0.5 }}>
               玩家1: {gameData.player1Config.character?.name || '未设置'}
             </Typography>
           )}
           {gameData.player2Config && (
             <Typography variant="body2" sx={{ mb: 0.5 }}>
               玩家2: {gameData.player2Config.character?.name || '未设置'}
             </Typography>
           )}
           <Typography variant="body2" sx={{ mb: 0.5, fontStyle: 'italic' }}>
             ✅ 刷新时保持此配置
           </Typography>
         </Box>
       )}

       {/* 加载遮罩 */}
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
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: '#ff5a5e' }}>
            🎮 游戏加载中...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            正在初始化共识征程战斗场景
          </Typography>
          {gameState === 'refreshing' && (
            <Typography variant="body2" color="primary">
              🔄 正在刷新游戏...
            </Typography>
          )}
        </Box>
      )}
      
      {/* 游戏容器 */}
      <div
        ref={gameRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          margin: 0,
          padding: 0,
        }}
      />
    </Box>
  );
};

export default PhaserGame;