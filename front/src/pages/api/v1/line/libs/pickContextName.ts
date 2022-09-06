import { DialogflowContext } from "@/types/models";

export const pickContextName = (context: DialogflowContext) => {
	if (!context.name) return context;
	const lastParam = context.name?.split("/").slice(-1)[0];
	context.name = lastParam;
	return context;
};
