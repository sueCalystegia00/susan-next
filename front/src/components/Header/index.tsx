import LogoHorizon from "@/assets/Logo-horizon.svg";
import HomeIcon from "@/assets/home_FILL0_wght200_GRAD0_opsz48.svg";
import ListIcon from "@/assets/list_FILL0_wght200_GRAD0_opsz48.svg";
import { useRouter } from "next/router";
import Link from "next/link";

const Header = () => {
	const router = useRouter();
	const icons = {
		// ["/questionsList" as string]: {
		// 	element: <HomeIcon height='70%' fill='#ffffff' />,
		// 	forwardLink: "/",
		// },
		["/question/[questionId]" as string]: {
			element: <ListIcon height='70%' fill='#ffffff' />,
			forwardLink: "/questionsList",
		},
	};
	console.log(router.pathname);
	return (
		<header className='relative w-full h-14 grid grid-cols-5 gap-2 place-items-center bg-susan-blue-100'>
			<Link href={icons[router.pathname]?.forwardLink || "/"}>
				{icons[router.pathname]?.element || <div></div>}
			</Link>
			<div className='col-span-3 h-full flex items-center content-center'>
				<LogoHorizon height='100%' />
			</div>
			<div className='invisible'></div>
		</header>
	);
};

export default Header;
