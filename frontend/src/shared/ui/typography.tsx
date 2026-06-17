import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import { cn } from '@/src/shared/utils/cn';

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
// | 'h6'
// | 'subtitle1'
// | 'subtitle2'
// | 'body1'
// | 'body2'
// | 'caption'
// | 'inherit';

const variantClasses: Record<TypographyVariant, string> = {
  h1: 'scroll-m-20 text-4xl font-semibold font-heading',
  h2: 'scroll-m-20 text-2xl font-medium font-heading',
  h3: 'scroll-m-20 text-xl font-medium font-heading',
  h4: 'scroll-m-20 text-base font-semibold font-heading',
  h5: 'scroll-m-20 text-sm font-medium font-heading'
  // h6: 'scroll-m-20 text-base font-semibold',
  // subtitle1: 'text-base font-semibold leading-6',
  // subtitle2: 'text-sm font-semibold leading-6',
  // body1: 'text-base leading-7',
  // body2: 'text-sm leading-6',
  // caption: 'text-xs leading-5 text-muted-foreground',
  // inherit: 'text-inherit font-inherit leading-inherit tracking-inherit'
};

const defaultVariantMapping: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5'
  // h6: 'h6',
  // subtitle1: 'h6',
  // subtitle2: 'h6',
  // body1: 'p',
  // body2: 'p',
  // caption: 'span',
  // inherit: 'p'
};

type TypographyProps<C extends ElementType = ElementType> = {
  component?: C;
  variant?: TypographyVariant;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<C>, 'className' | 'children'>;

export function Typography<C extends ElementType = 'p'>({
  component,
  variant = 'h5',
  className,
  ...props
}: TypographyProps<C>) {
  const Component = (component ??
    defaultVariantMapping[variant]) as ElementType;

  return (
    <Component className={cn(variantClasses[variant], className)} {...props} />
  );
}
