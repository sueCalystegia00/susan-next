// create LINE SDK config from env variables
export const linebotConfig = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
	channelSecret: process.env.CHANNEL_SECRET!,
};
