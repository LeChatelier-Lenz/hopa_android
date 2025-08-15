import React from 'react';
import { Avatar, AvatarProps } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface UserAvatarProps extends Omit<AvatarProps, 'src'> {
  src?: string;
  username?: string;
  size?: 'small' | 'medium' | 'large';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  username, 
  size = 'medium',
  ...props 
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 56;
      default: return 40;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar
      src={src}
      sx={{
        width: getSize(),
        height: getSize(),
        bgcolor: src ? 'transparent' : '#ff5a5e',
        fontSize: size === 'large' ? '1.2rem' : size === 'small' ? '0.8rem' : '1rem',
        fontWeight: 600,
      }}
      {...props}
    >
      {src ? null : username ? getInitials(username) : <PersonIcon />}
    </Avatar>
  );
};

export default UserAvatar;
