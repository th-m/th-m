import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva("thom-button", {
  variants: {
    variant: {
      default: "thom-button--default",
      outline: "thom-button--outline",
      ghost: "thom-button--ghost",
      link: "thom-button--link",
    },
    size: {
      default: "thom-button--size-default",
      sm: "thom-button--size-sm",
      lg: "thom-button--size-lg",
      icon: "thom-button--size-icon",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        type={type ?? (asChild ? undefined : "button")}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
