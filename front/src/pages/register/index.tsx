import { AuthContext } from "@/contexts/AuthContext";
import DefaultLayout from "@/layouts/Default";
import { useRouter } from "next/router";
import { useContext } from "react";

const RegisterPage = () => {
	const router = useRouter();
	const { user } = useContext(AuthContext);

	return (
		<DefaultLayout>
			<div className='relative w-full'>{JSON.stringify(user)}</div>
		</DefaultLayout>
	);
};

export default RegisterPage;
