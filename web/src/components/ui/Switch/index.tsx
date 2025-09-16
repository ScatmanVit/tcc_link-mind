import "./style.css";
import { memo } from "react";

type Props = {
	checked: boolean;
	onChange: (value: boolean) => void;
	disabled?: boolean;
};

const Switch = memo(function Switch({ checked, onChange, disabled }: Props) {
	return (
		<button
			className={"switch" + (checked ? " on" : "")}
			onClick={() => !disabled && onChange(!checked)}
			role="switch"
			aria-checked={checked}
			disabled={disabled}
		>
			<span className="knob" />
		</button>
	);
});

export default Switch;
