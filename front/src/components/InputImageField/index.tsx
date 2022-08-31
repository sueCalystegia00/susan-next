import usePostImage from "@/hooks/usePostImage";
import { InputImageFieldProps } from "./types";

const InputImageField = ({ questionIndex }: InputImageFieldProps) => {
	const { image, setImage, postHandler } = usePostImage(questionIndex);

	return (
		<div className='relative w-full flex flex-col items-center gap-2 p-4 '>
			<input
				id='input-image'
				type='file'
				accept='image/*'
				className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
				onChange={(e) => setImage(e.target.files![0])}
			/>
			<div className='flex items-center justify-center w-full min-h-[6rem] rounded-lg p-2 border border-gray-300 dark:bg-slate-600'>
				{!!image && <img src={URL.createObjectURL(image!)} />}
				<label htmlFor='input-image' className='input-image-label'>
					{!image ? "📁 画像(.jpeg, .png)を選択" : ""}
				</label>
			</div>
			<button
				className='bg-susan-blue-100 text-white disabled:text-slate-500 disabled:bg-slate-700 active:bg-susan-blue-50 font-bold px-8 py-2 rounded-2xl shadow-inner shadow-susan-blue-1000 outline-none focus:outline-none ease-linear transition-all duration-150'
				onClick={postHandler}
				disabled={!image}
			>
				送信
			</button>
		</div>
	);
};

export default InputImageField;
