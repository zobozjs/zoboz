import type { FC, ReactNode } from "react";

export const Anchor: FC<{ href: string; children: ReactNode }> = ({
	href,
	children,
}) => (
	<a
		className={[
			"flex",
			"gap-2",
			"items-center",
			"text-sm",
			"w-max",
			"hover:underline",
		].join(" ")}
		href={href}
		target="_blank"
		rel="noopener noreferrer"
	>
		{children}
	</a>
);
