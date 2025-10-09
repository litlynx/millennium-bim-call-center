import type { FC } from 'react';
import Icon from '../Icon';
import { Badge } from '../ui/badge';

interface AuthenticationBadgeProps {
  isAuthenticated: boolean;
  variant?: 'default' | 'filled';
}

const AuthenticationBadge: FC<AuthenticationBadgeProps> = ({
  isAuthenticated,
  variant = 'default'
}) => {
  const customStyle =
    variant === 'filled' && !isAuthenticated ? { backgroundColor: '#D1000326' } : {};

  return (
    <Badge variant="white" style={customStyle}>
      <span className={`text-xs font-medium ${!isAuthenticated ? 'text-red' : ''}`}>
        {isAuthenticated ? 'Cliente autenticado' : 'Cliente não autenticado'}
      </span>
      <Icon
        type={isAuthenticated ? 'checkRibbon' : 'crossRibbon'}
        size="md"
        className="p-0 ms-1 h-[10px] w-[10px] [&>svg]:w-[10px] [&>svg]:h-10px"
      />
    </Badge>
  );
};

export default AuthenticationBadge;
