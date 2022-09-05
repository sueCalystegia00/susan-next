import { contextLog } from "@/types/models";

export const pickContextName = (context: contextLog) => {
	if (!context.contextName) context.contextName = undefined;
	const lastParam = context.contextName?.split("/").slice(-1)[0];
	context.contextName = lastParam;
	return context;
};
