import LogoLight from "@/assets/Logo-light.svg";
import LogoDark from "@/assets/Logo-dark.svg";
import { useEffect, useState } from "react";
import LoginButton from "@/components/LoginButton";

const HomePage = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [agree, setAgree] = useState(false);

	useEffect(() => {
		setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
	}, []);

	return (
		<div className='w-screen min-h-screen p-4'>
			<div className='w-full flex flex-col items-center gap-4'>
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
						以下の実験説明を熟読の上，同意頂けましたら，LINEログインおよびアンケートへの回答をもって利用者登録をよろしくお願いします．
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

				<div className='flex gap-4 items-center'>
					<label>
						<input
							type='checkbox'
							id='agree'
							name='agree'
							value='agree'
							onChange={(e) => setAgree(e.target.checked)}
						/>
						同意する
					</label>
					<LoginButton disabled={!agree} />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
