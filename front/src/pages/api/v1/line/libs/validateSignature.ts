import crypto from "crypto";
/**
 * Compare x-line-signature request header and the signature
 * @param signature
 * @param body request body
 * @returns boolean
 */
const validateSignature = (
	body: string | Buffer,
	channelSecret: string,
	signature: string
) => {
	return (
		signature ==
		crypto.createHmac("SHA256", channelSecret).update(body).digest("base64")
	);
};

export default validateSignature;