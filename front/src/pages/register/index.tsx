import { AuthContext } from "@/contexts/AuthContext";
import useRegistration from "@/hooks/useRegistration";
import DefaultLayout from "@/layouts/Default";
import { useRouter } from "next/router";
import { useContext } from "react";

const RegisterPage = () => {
	const router = useRouter();
	const { user } = useContext(AuthContext);

	const { age, gender, canAnswer, userRegistration } = useRegistration(
		user?.token
	);

	const handleRegistration = async () => {
		try {
			await userRegistration();
			router.push("/questionsList");
		} catch (error) {
			if (error instanceof TypeError) {
				alert(error.message);
			} else {
				alert("ユーザ登録に失敗しました．時間を置いて再度お試しください．");
				console.error(error);
			}
		}
	};

	return (
		<DefaultLayout>
			<div className='relative max-w-full p-4 flex flex-col items-center gap-6'>
				<section className='max-w-full flex flex-col gap-2 items-center'>
					<h2 className='text-lg font-bold'>あなたの年齢を教えて下さい</h2>
					<label className='flex gap-2 items-center text-lg font-bold'>
						<input
							className='w-24 py-2 text-center border-2 border-gray-300 rounded-md'
							ref={age}
							type='number'
							placeholder='半角数字'
							min={18}
							max={99}
						/>
						歳
					</label>
				</section>

				<section className='max-w-full flex flex-col gap-2 items-center'>
					<h2 className='text-lg font-bold'>あなたの性別を教えて下さい</h2>
					<select
						className='px-4 py-2 text-center text-lg border-2 border-gray-300 rounded-md'
						ref={gender}
						defaultValue=''
					>
						<option disabled value=''>
							性別を選択してください
						</option>
						<option value='male'>男性</option>
						<option value='female'>女性</option>
						<option value='other'>その他</option>
					</select>
				</section>

				<section className='max-w-full flex flex-col gap-2 items-center'>
					<h2 className='text-lg font-bold'>回答に協力していただけますか？</h2>
					<div className='text-sm max-w-xl'>
						<p>
							質問が投稿された際に，教員と一緒に回答に協力していただける学生を募集しています．
						</p>
						<p>協力していただける場合でも，質問投稿はできます．</p>
						<p>
							協力していただいた学生は加点または別途自主演習の単位認定の対象となる場合があります．
						</p>
					</div>
					<label className='flex items-center gap-2 text-lg'>
						<input
							className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
							type='checkbox'
							ref={canAnswer}
						/>
						回答に協力する
					</label>
				</section>

				<button
					className='text-white bg-susanBlue-100 font-bold text-center rounded-lg px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700'
					onClick={handleRegistration}
				>
					実験に参加してSUSANを利用する
				</button>
			</div>
		</DefaultLayout>
	);
};

export default RegisterPage;
