import { forwardRef } from 'react';

const Button = forwardRef(({ children, className = '', variant = 'primary', onClick, disabled, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center px-8 py-3.5 rounded-full font-sans text-base transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[var(--color-rust)] text-[var(--color-cream)] hover:bg-[var(--color-rust-dark)]",
    secondary: "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-ink-light)]",
    outline: "border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-transparent",
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
