import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className={clsx("hero hero--primary", styles.heroBanner)}>
			<div className="container">
				<Heading as="h1" className="hero__title">
					{siteConfig.title}
				</Heading>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<div className={styles.buttons}>
					<Link
						className="button button--secondary button--lg"
						to="/docs/intro"
					>
						Getting Started
					</Link>
				</div>
			</div>
		</header>
	);
}

export default function Home(): ReactNode {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout
			title={`Hello from ${siteConfig.title}`}
			description="Description will go into a meta tag in <head />"
		>
			<HomepageHeader />
			<main>
				<HomepageFeatures />
				<LevelsOfControl />
			</main>
		</Layout>
	);
}

function LevelsOfControl() {
	return (
		<div className="container">
			<Heading as="h2">Choose Your Level of Control</Heading>
			<p>
				Zoboz adapts to your workflow. Whether you want a fully automated
				solution, a flexible post-build enhancer, or complete manual control,
				you decide how much support you need.
			</p>
			<Heading as="h3">1. Fully Automated: @zoboz/core</Heading>
			<p>
				The easiest way to make your package release-ready. @zoboz/core
				automatically generates TypeScript declaration files, ES modules, and
				CommonJS modules from your source code—so your package just works
				everywhere. Customize the output format with a simple config, or let it
				handle everything for you.
			</p>
			<Heading as="h3">2. Flexible Post-Build: @zoboz/bam</Heading>
			<p>
				Want more control? @zoboz/bam ensures your dist/ and package.json are
				fully compatible after your build process. It's toolchain-agnostic,
				meaning you can integrate it with any build system to tweak, fix, and
				enhance your package post-build—without giving up flexibility.
			</p>
			<Heading as="h3">3. Manual Control: Learn & Apply</Heading>
			<p>
				Prefer doing things yourself? Every best practice Zoboz enforces is
				fully documented. You can follow the lessons, manually apply the fixes,
				and refine your package however you like. If a rule is broken and can’t
				be auto-fixed, Zoboz will even provide a direct link to the relevant
				lesson in your console.
			</p>
		</div>
	);
}
