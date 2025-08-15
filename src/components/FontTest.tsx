import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';

const FontTest: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h1" sx={{ mb: 2, color: '#ff5a5e' }}>
        合拍 Hopa
      </Typography>
      
      <Typography variant="h2" sx={{ mb: 2 }}>
        深度个性化设置
      </Typography>
      
      <Typography variant="h3" sx={{ mb: 2 }}>
        共识达成平台
      </Typography>
      
      <Typography variant="h4" sx={{ mb: 2 }}>
        用户偏好设置
      </Typography>
      
      <Typography variant="h5" sx={{ mb: 2 }}>
        个性化建议
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        设置完成
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" sx={{ mr: 2 }}>
          发起共识
        </Button>
        <Button variant="outlined">
          返回首页
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Chip label="活跃用户" sx={{ mr: 1 }} />
        <Chip label="已完成" sx={{ mr: 1 }} />
        <Chip label="进行中" />
      </Box>
      
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        这是副标题文字，应该使用阿里妈妈数黑体
      </Typography>
      
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        这是小副标题文字，应该使用阿里妈妈数黑体
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        这是正文内容，应该保持系统字体（PingFang SC 等）
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 2 }}>
        这是小号正文内容，应该保持系统字体
      </Typography>
      
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          字体测试说明：
        </Typography>
        <Typography variant="body2">
          • 标题文字（H1-H6）应该使用阿里妈妈数黑体<br/>
          • 按钮文字应该使用阿里妈妈数黑体<br/>
          • 标签文字应该使用阿里妈妈数黑体<br/>
          • 副标题应该使用阿里妈妈数黑体<br/>
          • 正文内容应该保持系统字体
        </Typography>
      </Box>
    </Box>
  );
};

export default FontTest;
