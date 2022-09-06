import type { NextApiRequest, NextApiResponse } from "next";
import type { Middleware } from "@line/bot-sdk/dist/middleware";

/**
 * Helper method to wait for a middleware to execute before continuing
 * And to throw an error when an error happens in a middleware
 * @reference https://nextjs.org/docs/api-routes/api-middlewares
 */
const runMiddleware = (
	req: NextApiRequest,
	res: NextApiResponse,
	fn: Middleware
) => {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}
			return resolve(result);
		});
	});
};

export default runMiddleware;
