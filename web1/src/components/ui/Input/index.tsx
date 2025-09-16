import "./style.css";
import { InputHTMLAttributes, forwardRef, memo } from "react";
import cx from "classnames";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
};

const Input = memo(
  forwardRef<HTMLInputElement, Props>(function Input(
    { label, hint, className, ...rest },
    ref
  ) {
    return (
      <label className={cx("field", className)}>
        {label && <div className="label">{label}</div>}
        <input ref={ref} className="input" {...rest} />
        {hint && <div className="hint">{hint}</div>}
      </label>
    );
  })
);

export default Input;
