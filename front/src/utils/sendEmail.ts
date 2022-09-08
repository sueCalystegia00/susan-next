import nodemailer from "nodemailer";

const transportOptions = {
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // SSL
	auth: {
		user: process.env.SENDER_GMAIL_ADDRESS,
		pass: process.env.SENDER_GMAIL_PASSWORD,
	},
};

const mailOptions = (
	subject: string,
	message: string,
	questionIndex: number
) => ({
	from: process.env.SENDER_GMAIL_ADDRESS,
	to: process.env.RECEIVER_GMAIL_ADDRESS,
	subject: `【SUSAN】${subject}`,
	text: `${message}
  
  確認するにはこちらのURLをクリックしてください．
  https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/question/${questionIndex}`,
});

const sendEmail = async (
	subject: string,
	message: string,
	questionIndex: number
) => {
	const transporter = nodemailer.createTransport(transportOptions);
	await transporter.sendMail(
		mailOptions(subject, message, questionIndex),
		(err, info) => {
			if (err) {
				throw err;
			}
			console.log(info);
		}
	);
};

export default sendEmail;
