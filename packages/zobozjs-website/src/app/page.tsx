import Image from "next/image";
import { BookHeartIcon, Code, Link, Terminal, Zap } from "lucide-react";
import { ModeColumn } from "./ModeColumn";
import { Anchor } from "./Anchor";

export default function Home() {
	return (
		<div className="font-[family-name:var(--font-roboto-sans)]">
			<header className="py-4 mb-4">
				<div>
					<div className="w-full flex flex-col justify-center items-center gap-4">
						<Image
							className="rounded-full"
							src="/zoboz.png"
							alt="zoboz logo"
							width={96}
							height={96}
						/>
						<div
							style={{
								position: "absolute",
								fontSize: "64px",
								zIndex: -1,
								marginTop: 20,
								marginLeft: 0,
								opacity: 1,
							}}
						>
							⚡️
						</div>
						<div className="flex flex-col gap-4 relative">
							<h1
								className="text-6xl font-thin text-center text-accent"
								style={{ marginTop: -15, marginBottom: -20 }}
							>
								zoboz
							</h1>
							<p className="text-md m-0">Your Package. Release-Proof.</p>
						</div>
					</div>
				</div>
			</header>
			<main>
				<div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-6xl mx-auto">
					<ModeColumn
						title={
							<>
								<Zap /> @zoboz/core
							</>
						}
						subtitle={<code>{"src => d.ts + esm + cjs"}</code>}
						action={
							<Anchor href="https://npmjs.com/package/@zoboz/core">
								Get Started <Link size="14" />
							</Anchor>
						}
					>
						<>
							<p>
								Automatically generate TypeScript declaration files, ES modules,
								and CommonJS modules from your source code.
							</p>
							<p>
								You can control the output format and customize the generated
								files using a simple configuration file.
							</p>
						</>
					</ModeColumn>
					<ModeColumn
						title={
							<>
								<Terminal /> @zoboz/bam
							</>
						}
						subtitle={<p>boost compat of dist and package.json post-build</p>}
						action={
							<Anchor href="https://npmjs.com/package/@zoboz/bam">
								Get Started <Link size="14" />
							</Anchor>
						}
					>
						<>
							<p>
								If you want more customization than you can get with
								@zoboz/core, you can use zoboz-bam to run custom scripts after
								your project has been built.
							</p>
							<p>
								Using zoboz-bam directly, zoboz-bam will be agnostic of the
								toolchain you use. You can use it with any build tool.
							</p>
						</>
					</ModeColumn>
					<ModeColumn
						title={
							<>
								<BookHeartIcon /> Learn
							</>
						}
						subtitle={<p>learn the recommendations and apply manually</p>}
						action={
							<Anchor href="https://zobozjs.github.io/lessons">
								Get Started
							</Anchor>
						}
					>
						<p>
							All the principles and recommendations that zoboz uses are
							documented in the lessons. You can apply them manually to your
							project if you prefer.
						</p>
						<p>
							Also, whenever a rule is broken, and is not auto fixable, you will
							get a URL in the console. Pointing you to the lesson that explains
							the rule.
						</p>
					</ModeColumn>
				</div>
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/file.svg"
						alt="File icon"
						width={16}
						height={16}
					/>
					Lessons
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://github.com/zobozjs/zoboz"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Code />
					Github
				</a>
			</footer>
		</div>
	);
}
