import type { FC, ReactNode } from "react";

export const ModeColumn: FC<{
	title: ReactNode;
	subtitle: ReactNode;
	children: ReactNode;
	action: ReactNode;
}> = ({ title, subtitle, children, action }) => (
	<div className="flex-1 p-4">
		<h2 className="text-2xl mb-0 flex items-center gap-2 text-accent">
			{title}
		</h2>
		<div className="text-sm mb-2">{subtitle}</div>
		<div className="text-gray-600 dark:text-gray-300">{children}</div>
		<div className="flex flex-row-reverse gap-2">{action}</div>
	</div>
);
