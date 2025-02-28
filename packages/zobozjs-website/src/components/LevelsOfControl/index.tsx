import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css"; // Custom CSS file

const levels = [
	{
		level: "⚡ Fully Automated",
		approach: "@zoboz/core",
		description:
			"The easiest way to make your package release-ready. @zoboz/core automatically generates TypeScript declaration files, ES modules, and CommonJS modules from your source code—so your package just works everywhere. Customize the output format with a simple config, or let it handle everything for you.",
		ctaTitle: "Get Started with @zoboz/core",
		docsLink: "/docs/core/intro",
	},
	{
		level: "🛠️ Flexible Post-Build",
		approach: "@zoboz/bam",
		description:
			"Want more control? @zoboz/bam ensures your dist/ and package.json are fully compatible after your build process. It's toolchain-agnostic, meaning you can integrate it with any build system to tweak, fix, and enhance your package post-build—without giving up flexibility.",
		ctaTitle: "Get Started with @zoboz/bam",
		docsLink: "/docs/bam/intro",
	},
	{
		level: "📖 Manual Control",
		approach: "Learn & Apply",
		description:
			"Prefer doing things yourself? Every best practice Zoboz enforces is fully documented. You can follow the lessons, manually apply the fixes, and refine your package however you like. If a rule is broken and can’t be auto-fixed, Zoboz will even provide a direct link to the relevant lesson in your console.",
		ctaTitle: "Start Learning",
		docsLink: "/docs/learn/intro",
	},
];

export function LevelsOfControl() {
	return (
		<section className={styles.container}>
			<h2 className={styles.title}>🎚️ Choose Your Level of Control</h2>
			<p className={styles.description}>
				Zoboz adapts to your workflow. Whether you want a fully automated
				solution, a flexible post-build enhancer, or complete manual control,
				you decide how much support you need.
			</p>
			<div className={styles.grid}>
				{levels.map((level, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={index} className={clsx(styles.card)}>
						<h3 className={styles.cardTitle}>{level.level}</h3>
						<h4>{level.approach}</h4>
						<p>{level.description}</p>
						<a href={level.docsLink} className={styles.docButton}>
							{level.ctaTitle}
						</a>
					</div>
				))}
			</div>
		</section>
	);
}
