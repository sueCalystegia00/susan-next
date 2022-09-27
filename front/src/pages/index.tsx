import LogoLight from "@/assets/Logo-light.svg";
import LogoDark from "@/assets/Logo-dark.svg";
import { useContext, useEffect, useState } from "react";
import DefaultLayout from "@/layouts/Default";
import useRegistration from "@/hooks/useRegistration";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";

const HomePage = () => {
	const router = useRouter();
	const { user } = useContext(AuthContext);
	const [isDarkMode, setIsDarkMode] = useState(false);

	const { age, gender, canAnswer, userRegistration } = useRegistration(
		user?.token
	);

	useEffect(() => {
		setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
	}, []);

	const handleRegistration = async () => {
		try {
			await userRegistration();
			alert("ユーザ登録が完了しました．");
			router.replace("/questionsList");
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
			{user?.type === "unregistered" ? (
				<div className='w-full min-h-screen flex flex-col items-center gap-4 p-4'>
					{!isDarkMode ? (
						<LogoLight height='128px' />
					) : (
						<LogoDark height='128px' />
					)}
					<h1 className='text-lg font-bold'>⚠️利用者登録をお願いします</h1>

					<section className='max-w-full flex flex-col gap-2 items-start'>
						<h2 className='text-lg font-bold'>『SUSAN』ってなに？</h2>
						<p className='indent-4'>
							SUSANは，学生からの質問対応を行うチャットボットシステムです．
							このシステムは実験的に運用しており，
							<span className='font-bold underline underline-offset-[-3px] decoration-4 decoration-sky-500/50'>
								学生には被験者として同意の上，利用していただく必要があります．
							</span>
						</p>
						<p className='indent-4'>
							以下の実験説明を熟読の上，同意頂けましたら，アンケートへの回答をもって利用者登録をよろしくお願いします．
						</p>
					</section>

					<div className='w-full h-96 flex flex-col items-center gap-4 overflow-y-scroll p-2 border-2 border-slate-500 rounded'>
						<section className='max-w-full flex flex-col gap-2 items-start'>
							<h2 className='text-lg font-bold'>実験概要</h2>
							<p className='indent-4'>
								「2022年度データサイエンス入門A/B」の講義における質問を，任意のタイミングでチャットボットに送信してください．
								質問文を
								<span className='font-bold underline underline-offset-[-3px] decoration-4 decoration-sky-500/50'>
									ボットを仲介して教員や回答に協力していただける学生方に匿名で送信
								</span>
								し，回答を依頼します．もし既に類似する質問が存在した場合はボットが自動で回答いたします．
							</p>
							<p className='indent-4'>
								なお質疑応答は全ての学生に共有されます．
								他の学生の質問も参考にし，講義に対する理解につなげていただければと思います．
							</p>
						</section>

						<section className='max-w-full flex flex-col gap-2 items-start'>
							<h2 className='text-lg font-bold'>実験手順</h2>
							<ol className='indent-4 list-decimal list-inside'>
								<li>実験期間中，システムを自由に利用．</li>
								<li>実験終了日にアンケート調査</li>
							</ol>
							<p className='indent-4'>
								アンケートはチャットボットを介して配信させていただきますので，実験終了後のアンケートまで
								<span className='font-bold underline underline-offset-[-3px] decoration-4 decoration-sky-500/50'>
									本アカウントの削除はご遠慮いただくよう，
								</span>
								よろしくおねがいします．
							</p>
						</section>

						<section className='max-w-full flex flex-col gap-2 items-start'>
							<h2 className='text-lg font-bold'>被験者の権利について</h2>
							<p className='indent-4'>
								本実験において行われた質問の内容や回数が，
								<span className='font-bold underline underline-offset-[-3px] decoration-4 decoration-sky-500/50'>
									授業の成績に反映されることは一切ありません．
								</span>
								ただし
								<span className='font-bold underline underline-offset-[-3px] decoration-4 decoration-sky-500/50'>
									回答に協力していただいた学生は，実験終了後に確認の上，加点の対象となる場合があります．
								</span>
								本実験の被験者になることは自由意志に寄るものであり，実験に関して説明に納得がいかない場合や，精神的不調をきたした場合は，いつでも実験を取りやめることができます．
								またこのことによる不利益は生じません．
							</p>
						</section>

						<section className='max-w-full flex flex-col gap-2 items-start'>
							<h2 className='text-lg font-bold'>取得する情報</h2>
							<p className='indent-4'>
								本実験中に記録するデータは以下の通りとなっています．
							</p>
							<ul className='indent-4 list-disc list-inside'>
								<li>ユーザ識別子(LINE UID)</li>
								<li>チャットボットに送信されたメッセージ</li>
								<li>連携Webアプリ内で送信されたメッセージ</li>
							</ul>
							<p className='indent-4'>
								ユーザは固有のIDで判別しており，
								<span className='font-bold underline underline-offset-[-3px] decoration-4 decoration-sky-500/50'>
									ユーザ名やプロフィール画像の取得はしていません．
								</span>
								このため，教員や他ユーザは，ユーザの個人情報を特定できません．
							</p>
							<p className='indent-4'>
								ただし，ボットに送信されたメッセージは確認可能であるため，個人名や住所，パスワードなどの
								<span className='font-bold underline underline-offset-[-3px] decoration-4 decoration-sky-500/50'>
									個人情報は送信しないようご注意ください．
								</span>
							</p>
							<p className='indent-4'>
								また実験により取得したデータは，学会や学術雑誌などに公開される場合があります．
								この際，いかなる場合においても被験者のプライバシーに関わる情報は外部に出しません．
								実験において記録したデータを公開する場合，被験者個人が対応付けられない状態でのシステム利用データの公開は承諾ください．
							</p>
						</section>
					</div>

					<div className='w-full flex flex-col gap-4'>
						<section className='max-w-full flex flex-col gap-2 items-start'>
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

						<section className='max-w-full flex flex-col gap-2 items-start'>
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

						<section className='max-w-full flex flex-col gap-2 items-start'>
							<h2 className='text-lg font-bold'>
								回答に協力していただけますか？
							</h2>
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
					</div>

					<div className='flex gap-4 items-center'>
						<button
							className='text-white bg-susanBlue-100 font-bold text-center rounded-lg px-5 py-2.5 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700'
							onClick={handleRegistration}
						>
							実験に参加してSUSANを利用する
						</button>
					</div>
				</div>
			) : (
				<div className='relative w-full flex flex-col items-center justify-center gap-5 p-5'>
					<p>実験参加ありがとうございます．</p>
					<Link href='/questionsList'>
						<a className='text-white text-lg font-bold bg-susanBlue-100 rounded-lg px-5 py-2.5'>
							👉 質問一覧へ
						</a>
					</Link>
				</div>
			)}
		</DefaultLayout>
	);
};

export default HomePage;
