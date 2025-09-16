import "./style.css";
import { memo, ButtonHTMLAttributes, forwardRef } from "react";
import cx from "classnames";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  loading?: boolean;
};

const Button = memo(
  forwardRef<HTMLButtonElement, Props>(function Button(
    { className, variant = "primary", loading, children, disabled, ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cx("btn", variant, className)}
        aria-busy={loading}
        disabled={loading || disabled}
        {...rest}
      >
        {loading ? "Carregando…" : children}
      </button>
    );
  })
);

export default Button;
