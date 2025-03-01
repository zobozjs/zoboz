import Heading from "@theme/Heading";
import type { ReactNode } from "react";
import styles from "./styles.module.css";

type FeatureItem = {
	title: string;
	Svg: React.ComponentType<React.ComponentProps<"svg">>;
	description: ReactNode;
};

const FeatureList: FeatureItem[] = [
	{
		title: "✅ Release-Ready Package Metadata",
		Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
		description: (
			<>
				Zoboz ensures your <code>package.json</code> is structured correctly for
				a successful release. It catches missing dependencies, validates exports
				and related fields, and prevents configuration mistakes that could break
				your package after publishing.
			</>
		),
	},
	{
		title: "🔥 Blazing-Fast & Rust-Powered",
		Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
		description: (
			<>
				Built with Rust for raw speed, Zoboz analyzes and fixes package issues
				in milliseconds. It’s faster than anything you’ve used before, with zero
				bloat and instant feedback.
			</>
		),
	},
	{
		title: "💎 Universal & Future-Proof",
		Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
		description: (
			<>
				Zoboz guarantees compatibility across CommonJS, ESM, and TypeScript. It
				verifies exports, main, types, module, dependencies, and all
				release-critical fields — ensuring your package works everywhere,
				exactly as expected.
			</>
		),
	},
];

function Feature({ title, Svg, description }: FeatureItem) {
	return (
		<div className="col col--4">
			{/* <div className="text--center">
				<Svg className={styles.featureSvg} role="img" />
			</div> */}
			<Heading as="h3">{title}</Heading>
			<p>{description}</p>
		</div>
	);
}

export default function HomepageFeatures(): ReactNode {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
