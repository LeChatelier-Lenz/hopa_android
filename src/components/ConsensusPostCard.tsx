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
import UserAvatar from './UserAvatar';

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
        '&:hover': { 
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.3s ease',
      }}
      onClick={handleClick}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* 用户信息区域 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#ff5a5e', fontWeight: 500 }}>
                Hopa值: {user.hopaValue}
              </Typography>
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
                  bgcolor: '#f0f0f0',
                  color: '#666',
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            ))}
          </Box>
        )}

        {/* 图片预览 */}
        {content.image && (
          <Box sx={{ mb: 2 }}>
            <img
              src={content.image}
              alt="共识内容"
              style={{
                width: '100%',
                height: 120,
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
          </Box>
        )}
      </CardContent>

      {/* 交互区域 */}
      <CardActions sx={{ pt: 0, pb: 1, px: 2 }}>
        <IconButton 
          size="small" 
          onClick={handleLike}
          sx={{ color: stats.isLiked ? '#ff5a5e' : '#666' }}
        >
          {stats.isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
        <Typography variant="caption" sx={{ color: '#666', mr: 1 }}>
          {stats.likes}
        </Typography>

        <IconButton 
          size="small" 
          onClick={handleComment}
          sx={{ color: '#666' }}
        >
          <ChatBubbleOutlineIcon fontSize="small" />
        </IconButton>
        <Typography variant="caption" sx={{ color: '#666', mr: 1 }}>
          {stats.comments}
        </Typography>

        <Box sx={{ flex: 1 }} />

        <IconButton 
          size="small" 
          onClick={handleBookmark}
          sx={{ color: stats.isBookmarked ? '#ff5a5e' : '#666' }}
        >
          {stats.isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ConsensusPostCard;
