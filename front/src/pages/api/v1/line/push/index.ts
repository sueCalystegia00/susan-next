import type { NextApiRequest, NextApiResponse } from "next";


const LinePushMessageHandler = async (
	req: NextApiRequest,
	res: NextApiResponse
) => {
	const { method, query, body } = req;
	switch (method) {
		case "GET":
      res.status(200).json({ message: "active!" });
      break;

    case "POST":
      

		default:
			res.setHeader("Allow", ["GET"]);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
};
export default LinePushMessageHandler;
