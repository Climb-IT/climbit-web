import { isValidElement, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import md from "./content.md?raw";
import styles from "./styles.module.css";

// Media live next to the report under public/, served at this base path.
const ASSET_BASE = "/tasks/36367-atlas-code-review/";

function toText(node: ReactNode): string {
	if (typeof node === "string") return node;
	if (typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(toText).join("");
	if (isValidElement(node)) {
		return toText((node.props as { children?: ReactNode }).children);
	}
	return "";
}

function asset(url: string): string {
	return ASSET_BASE + url.replace(/^\.\//, "");
}

const components: Components = {
	// `[video](./UX-1.mp4)` -> inline playable video with its poster frame.
	a({ href, children }) {
		if (href && /\.mp4($|\?)/.test(href)) {
			return (
				// biome-ignore lint/a11y/useMediaCaption: short UI screen recordings, no audio track
				<video
					className={styles.video}
					src={asset(href)}
					controls
					preload="metadata"
				/>
			);
		}
		return (
			<a href={href} target="_blank" rel="noreferrer">
				{children}
			</a>
		);
	},
	img({ src, alt }) {
		const url = typeof src === "string" ? asset(src) : undefined;
		return (
			<img className={styles.img} src={url} alt={alt ?? ""} loading="lazy" />
		);
	},
	// Style the severity legend and the migration estimate as callouts.
	p({ children }) {
		const text = toText(children);
		if (text.startsWith("Severity:")) {
			return <p className={styles.legend}>{children}</p>;
		}
		if (text.includes("mandatory before proceeding")) {
			return <p className={styles.callout}>{children}</p>;
		}
		return <p>{children}</p>;
	},
};

export default function Report() {
	return (
		<div className={styles.report}>
			<Markdown
				remarkPlugins={[remarkGfm]}
				urlTransform={(url) => url}
				components={components}
			>
				{md}
			</Markdown>
		</div>
	);
}
