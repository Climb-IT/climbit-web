import { isValidElement, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import md from "./content.md?raw";

// Media live in public/tasks/..., served at this base path (separate from the route).
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
	h1: ({ children }) => (
		<h1 className="mb-1 border-[#0b3d91] border-b-2 pb-2 font-heading text-5xl text-[#0b3d91] leading-tight tracking-wide">
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2 className="mt-10 mb-2 border-[#d0d7de] border-b pb-1 font-heading text-3xl text-[#0b3d91] tracking-wide">
			{children}
		</h2>
	),
	h3: ({ children }) => (
		<h3 className="mt-6 mb-1.5 font-semibold text-[#24292f] text-lg">
			{children}
		</h3>
	),
	p: ({ children }) => {
		const text = toText(children);
		if (text.startsWith("Severity:")) {
			return (
				<p className="my-3 rounded-md border border-[#d0d7de] bg-[#f6f8fa] px-3.5 py-2.5 text-sm">
					{children}
				</p>
			);
		}
		if (text.includes("mandatory before proceeding")) {
			return (
				<p className="my-3 border-[#d4a72c] border-l-4 bg-[#fff8c5] px-3.5 py-2.5 text-sm">
					{children}
				</p>
			);
		}
		return <p className="my-2">{children}</p>;
	},
	ul: ({ children }) => <ul className="my-2 list-disc pl-6">{children}</ul>,
	ol: ({ children }) => <ol className="my-2 list-decimal pl-6">{children}</ol>,
	li: ({ children }) => <li className="my-1">{children}</li>,
	hr: () => <hr className="my-6 border-[#d0d7de] border-t" />,
	code: ({ children }) => (
		<code className="rounded bg-[#f6f8fa] px-1.5 py-0.5 font-mono text-[13px]">
			{children}
		</code>
	),
	// `[video](./UX-1.mp4)` -> inline playable video.
	a({ href, children }) {
		if (href && /\.mp4($|\?)/.test(href)) {
			return (
				// biome-ignore lint/a11y/useMediaCaption: short UI screen recordings, no audio track
				<video
					className="my-3 block w-full max-w-full rounded-md border border-[#d0d7de] bg-black"
					src={asset(href)}
					controls
					preload="metadata"
				/>
			);
		}
		return (
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
				className="text-[#0969da] hover:underline"
			>
				{children}
			</a>
		);
	},
	img({ src, alt }) {
		const url = typeof src === "string" ? asset(src) : undefined;
		return (
			<img
				className="my-3 block max-w-full rounded-md border border-[#d0d7de]"
				src={url}
				alt={alt ?? ""}
				loading="lazy"
			/>
		);
	},
};

export default function Report() {
	return (
		<div className="mx-auto max-w-[980px] bg-white px-5 pt-6 pb-16 text-left text-[#1b1f24] text-[15px] leading-relaxed">
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
