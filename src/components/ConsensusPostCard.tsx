import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UserAvatar from './UserAvatar';
import faceWatermark from '../assets/images/face.png';

interface ConsensusPostCardProps {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    hopaValue: number;
  };
  content: {
    title: string;
    description: string;
    image?: string;
  };
  stats: {
    likes: number;
    comments: number;
    isLiked: boolean;
    isBookmarked: boolean;
  };
  tags?: string[];
  onLike?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onComment?: (id: string) => void;
  onClick?: (id: string) => void;
}

const ConsensusPostCard: React.FC<ConsensusPostCardProps> = ({
  id,
  user,
  content,
  stats,
  tags = [],
  onLike,
  onBookmark,
  onComment,
  onClick,
}) => {
  const handleLike = () => {
    onLike?.(id);
  };

  const handleBookmark = () => {
    onBookmark?.(id);
  };

  const handleComment = () => {
    onComment?.(id);
  };

  const handleClick = () => {
    onClick?.(id);
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
        border: '1px solid rgba(255, 90, 94, 0.1)',
        '&:hover': { 
          boxShadow: '0 8px 32px rgba(255, 90, 94, 0.15)',
          transform: 'translateY(-4px)',
          borderColor: 'rgba(255, 90, 94, 0.2)',
        },
        transition: 'all 0.3s ease',
      }}
      onClick={handleClick}
    >
      {/* 水印背景 */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '-30px',
          transform: 'translateY(-50%) rotate(-15deg)',
          width: '120px',
          height: '120px',
          opacity: 1,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <img
          src={faceWatermark}
          alt="水印"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'brightness(0) saturate(100%) invert(62%) sepia(32%) saturate(1199%) hue-rotate(346deg) brightness(93%) contrast(91%)', 
          }}
        />
      </Box>

      {/* 左上角Hopa装饰 */}
      <Box
        sx={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'linear-gradient(135deg, #FF595D 0%, #FF782A 100%)',
          borderRadius: '12px',
          padding: '6px',
          boxShadow: '0 4px 12px rgba(255, 90, 94, 0.3)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* <TrendingUpIcon sx={{ fontSize: 16, color: '#ffffff' }} /> */}
      </Box>

      <CardContent sx={{ pb: 1, position: 'relative', zIndex: 1 }}>
        {/* 用户信息区域 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
          <UserAvatar 
            username={user.name} 
            src={user.avatar} 
            size="small"
            sx={{ mr: 1.5 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#333' }}>
              {user.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #FF595D 0%, #FF782A 100%)',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <TrendingUpIcon sx={{ fontSize: 12, color: '#ffffff' }} />
                <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 700, fontSize: '10px' }}>
                  {user.hopaValue} Hopa
                </Typography>
              </Box>
              
            </Box>
          </Box>
        </Box>

        {/* 内容区域 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
            {content.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
            {content.description}
          </Typography>
        </Box>

        {/* 标签 */}
        {tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, rgba(255, 90, 94, 0.1) 0%, rgba(255, 120, 42, 0.1) 100%)',
                  color: '#ff5a5e',
                  fontSize: '0.75rem',
                  height: 24,
                  fontWeight: 600,
                  border: '1px solid rgba(255, 90, 94, 0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255, 90, 94, 0.15) 0%, rgba(255, 120, 42, 0.15) 100%)',
                  },
                }}
              />
            ))}
          </Box>
        )}

        {/* 图片预览 */}
        {content.image && (
          <Box sx={{ mb: 2, position: 'relative' }}>
            <img
              src={content.image}
              alt="共识内容"
              style={{
                width: '100%',
                height: 120,
                objectFit: 'cover',
                borderRadius: 12,
              }}
            />
            {/* 图片上的Hopa装饰 */}
            <Box
              sx={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                padding: '4px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 14, color: '#ff5a5e' }} />
            </Box>
          </Box>
        )}
      </CardContent>

      {/* 交互区域 */}
      <CardActions sx={{ pt: 0, pb: 1, px: 2, position: 'relative', zIndex: 1 }}>
        <IconButton 
          size="small" 
          onClick={handleLike}
          sx={{ 
            color: stats.isLiked ? '#ff5a5e' : '#666',
            background: stats.isLiked ? 'rgba(255, 90, 94, 0.1)' : 'transparent',
            borderRadius: '8px',
            '&:hover': {
              background: 'rgba(255, 90, 94, 0.1)',
            },
          }}
        >
          {stats.isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
        <Typography variant="caption" sx={{ color: '#666', mr: 1, fontWeight: 600 }}>
          {stats.likes}
        </Typography>

        <IconButton 
          size="small" 
          onClick={handleComment}
          sx={{ 
            color: '#666',
            borderRadius: '8px',
            '&:hover': {
              background: 'rgba(255, 90, 94, 0.1)',
              color: '#ff5a5e',
            },
          }}
        >
          <ChatBubbleOutlineIcon fontSize="small" />
        </IconButton>
        <Typography variant="caption" sx={{ color: '#666', mr: 1, fontWeight: 600 }}>
          {stats.comments}
        </Typography>

        <Box sx={{ flex: 1 }} />

        <IconButton 
          size="small" 
          onClick={handleBookmark}
          sx={{ 
            color: stats.isBookmarked ? '#ff5a5e' : '#666',
            background: stats.isBookmarked ? 'rgba(255, 90, 94, 0.1)' : 'transparent',
            borderRadius: '8px',
            '&:hover': {
              background: 'rgba(255, 90, 94, 0.1)',
            },
          }}
        >
          {stats.isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ConsensusPostCard;
