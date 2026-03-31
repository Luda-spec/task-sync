import clsx from 'clsx';
import React from 'react';

type TitleSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface Props {
  size?: TitleSize;
  className?: string;
  text: string;
}

export const Title: React.FC<Props> = ({ text, size = 'sm', className }) => {
  const mapTagBySize = {
    '2xs': 'h6',
    xs: 'h5',
    sm: 'h4',
    md: 'h3',
    lg: 'h2',
    xl: 'h1',
    '2xl': 'h1',
  } as const;

  const mapClassNameBySize = {
    '2xs': 'text-[9px]',
    xs: 'text-[11px]',
    sm: 'text-[14px]',
    md: 'text-[19px]',
    lg: 'text-[24px]',
    xl: 'text-[32px]',
    '2xl': 'text-[40px]',
  } as const;

  return React.createElement(
    mapTagBySize[size],
    {
      className: clsx('text-foreground', mapClassNameBySize[size], className),
    },
    text
  );
};