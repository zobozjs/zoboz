import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import CodeBlock from "@theme/CodeBlock";
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
							{`
// zoboz.config.ts

import { BuildConfig, tsc, esbuild } from "@zoboz/core"

export default new BuildConfig({
  esm: esbuild.esm(), // or tsc.esm()
  cjs: esbuild.cjs(), // or tsc.cjs()
  dts: tsc.dts(),
  srcDir: "./src",
  distDir: "./dist",
  exports: {
    ".": "./src/index.ts",
  },
})

// Zoboz will build your package
// and handle package.json fields
        `}
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
