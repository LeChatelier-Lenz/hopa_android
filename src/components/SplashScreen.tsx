import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import startupImage from '../assets/images/startup.png';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number; // 动画持续时间（毫秒）
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  duration = 3000 
}) => {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    // 第一阶段：图片淡入和缩放
    const timer1 = setTimeout(() => {
      setOpacity(1);
      setScale(1);
    }, 100);

    // 第二阶段：整体淡出
    const timer2 = setTimeout(() => {
      setOpacity(0);
    }, duration - 500);

    // 完成动画
    const timer3 = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete, duration]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #ff5a5e 0%, #ff7a7e 50%, #ffffff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* 背景渐变效果 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, rgba(255, 90, 94, 0.05) 100%)',
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 0.5,
            },
            '50%': {
              opacity: 0.8,
            },
          },
        }}
      />

             {/* 背景图片容器 - 填充整个屏幕 */}
       <Box
         sx={{
           position: 'absolute',
           top: 0,
           left: 0,
           width: '100%',
           height: '100%',
           opacity,
           transform: `scale(${scale})`,
           transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
           overflow: 'hidden',
         }}
       >
         {/* 启动图片 - 填充整个屏幕 */}
         <Box
           component="img"
           src={startupImage}
           alt="合拍 Hopa"
           sx={{
             width: '100%',
             height: '100%',
             objectFit: 'cover',
             objectPosition: 'center',
             filter: 'brightness(0.9) contrast(1.1)',
           }}
         />
         
         {/* 图片遮罩层 - 增强文字可读性 */}
         <Box
           sx={{
             position: 'absolute',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             background: 'linear-gradient(135deg, rgba(255, 90, 94, 0.3) 0%, rgba(255, 122, 126, 0.2) 50%, rgba(255, 255, 255, 0.1) 100%)',
           }}
         />
       </Box>

      

             {/* 加载指示器 */}
       <Box
         sx={{
           position: 'absolute',
           bottom: '15%',
           left: '50%',
           transform: 'translateX(-50%)',
           display: 'flex',
           gap: 1,
           zIndex: 3,
         }}
       >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              animation: `bounce 1.4s ease-in-out infinite both`,
              animationDelay: `${index * 0.16}s`,
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)',
                },
                '40%': {
                  transform: 'scale(1)',
                },
              },
            }}
          />
        ))}
      </Box>

             {/* 装饰性元素 */}
       <Box
         sx={{
           position: 'absolute',
           top: '8%',
           right: '8%',
           width: 80,
           height: 80,
           borderRadius: '50%',
           background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
           animation: 'rotate 12s linear infinite',
           zIndex: 2,
           '@keyframes rotate': {
             '0%': {
               transform: 'rotate(0deg)',
             },
             '100%': {
               transform: 'rotate(360deg)',
             },
           },
         }}
       />

       <Box
         sx={{
           position: 'absolute',
           bottom: '12%',
           left: '8%',
           width: 60,
           height: 60,
           borderRadius: '50%',
           background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
           animation: 'rotate 8s linear infinite reverse',
           zIndex: 2,
         }}
       />

       {/* 额外的装饰元素 */}
       <Box
         sx={{
           position: 'absolute',
           top: '20%',
           left: '15%',
           width: 40,
           height: 40,
           borderRadius: '50%',
           background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
           animation: 'rotate 10s linear infinite',
           zIndex: 2,
         }}
       />

       <Box
         sx={{
           position: 'absolute',
           bottom: '25%',
           right: '20%',
           width: 50,
           height: 50,
           borderRadius: '50%',
           background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
           animation: 'rotate 15s linear infinite reverse',
           zIndex: 2,
         }}
       />
    </Box>
  );
};

export default SplashScreen;
