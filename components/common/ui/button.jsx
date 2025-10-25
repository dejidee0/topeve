import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      children,
      className = "",
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-black text-white hover:bg-gray-800 focus:ring-black",
      outline:
        "border-2 border-black text-black hover:bg-black hover:text-white focus:ring-black",
      ghost: "hover:bg-gray-100 focus:ring-gray-400",
    };

    const sizes = {
      default: "px-6 py-3 text-sm",
      sm: "px-4 py-2 text-xs",
      lg: "px-8 py-4 text-base",
    };

    const variantStyle = variants[variant] || variants.default;
    const sizeStyle = sizes[size] || sizes.default;

    const classes = `${baseStyles} ${variantStyle} ${sizeStyle} ${className}`;

    if (asChild) {
      return children;
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
