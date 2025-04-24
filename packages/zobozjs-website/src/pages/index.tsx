import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import CodeBlock from "@theme/CodeBlock";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import clsx from "clsx";
import type { ReactNode } from "react";

import { LevelsOfControl } from "../components/LevelsOfControl";
import styles from "./index.module.css";

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className={clsx("hero hero--primary", styles.heroBanner)}>
			<div className="container">
				<div className="row">
					<div className="col col--6 margin-vert--lg items-center justify-center">
						<div>
							<img
								className="homepage-logo"
								src="img/logo.svg"
								alt="Zoboz Logo"
							/>
							<Heading as="h1" className="hero__title">
								{siteConfig.title}
							</Heading>
							<p className="hero__subtitle">{siteConfig.tagline}</p>
							<div className={styles.buttons}>
								<Link
									className="button button--secondary button--md"
									to="/docs/intro"
								>
									Getting Started
								</Link>
							</div>
						</div>
					</div>
					<div className="col col--6 text--left">
						<CodeBlock language="typescript">
							{`// zoboz.config.ts

import { BuildConfig, tsc, esbuild } from "@zoboz/core"

export default new BuildConfig({
  esm: {}, // = { js: esbuild.esm(), dts: tsc.esm.dts() }
  cjs: {}, // = { js: esbuild.cjs(), dts: tsc.cjs.dts() }
  srcDir: "./src",
  distDir: "./dist",
  exports: {
    ".": "./src/index.ts",
  },
})`}
						</CodeBlock>
						<CodeBlock language="bash">
							{"npx zoboz build --can-update-package-json"}
						</CodeBlock>
					</div>
				</div>
			</div>
		</header>
	);
}

export default function Home(): ReactNode {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout title="" description={siteConfig.tagline}>
			<HomepageHeader />
			<main>
				<HomepageFeatures />
				<hr className="container margin-bottom--lg" />
				<LevelsOfControl />
			</main>
		</Layout>
	);
}
