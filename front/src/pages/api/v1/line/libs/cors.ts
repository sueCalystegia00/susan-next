import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

// CORS のミドルウェアを初期化
export const cors = Cors({
	methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export const runMiddleware = (
	req: NextApiRequest,
	res: NextApiResponse,
	fn: Function
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
