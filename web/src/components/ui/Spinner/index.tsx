import "./style.css";
export default function Spinner({ size = 18 }: { size?: number }) {
	const s = `${size}px`;
	return <span className="spinner" style={{ width: s, height: s }} />;
}
