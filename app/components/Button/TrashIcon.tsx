import { Trash2 } from 'lucide-react';
import { FC } from 'react';
import { cn } from '~/ui/utils';

interface DeleteButtonProps {
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const TrashIcon: FC<DeleteButtonProps> = ({
   size = 40,
   color = '#d11a2a',
   className,
   onClick,
}) => {
  return (
    <Trash2
      size={size}
      color={color}
      className={cn('cursor-pointer stroke-20', className)}
      onClick={onClick}
    />
  );
};
