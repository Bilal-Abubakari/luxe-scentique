import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-medium',
    'transition-all duration-200 ease-luxury',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-gold text-onyx',
          'hover:bg-gold-500 hover:shadow-gold-md',
          'focus-visible:ring-offset-cream',
        ].join(' '),
        outline: [
          'border-2 border-gold text-gold bg-transparent',
          'hover:bg-gold hover:text-onyx',
          'focus-visible:ring-offset-cream',
        ].join(' '),
        ghost: [
          'text-onyx bg-transparent',
          'hover:bg-onyx-100 hover:text-onyx',
          'focus-visible:ring-offset-cream',
        ].join(' '),
        destructive: [
          'bg-red-600 text-white',
          'hover:bg-red-700 hover:shadow-sm',
          'focus-visible:ring-red-500 focus-visible:ring-offset-cream',
        ].join(' '),
        link: [
          'text-gold underline-offset-4 bg-transparent',
          'hover:underline hover:text-gold-500',
          'focus-visible:ring-offset-cream',
          'h-auto p-0',
        ].join(' '),
        secondary: [
          'bg-onyx text-cream',
          'hover:bg-onyx-800',
          'focus-visible:ring-onyx focus-visible:ring-offset-cream',
        ].join(' '),
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded',
        default: 'h-10 px-6 py-2 text-sm',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || isLoading;

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        aria-label={ariaLabel}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
