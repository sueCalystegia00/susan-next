import { TileRadioButtonProps } from "./types";

const TileRadioButton = ({
	id,
	name,
	value,
	imageComponent,
	displayText,
	onChange,
	defaultCheckedValue,
}: TileRadioButtonProps) => {
	return (
		<div>
			<input
				type='radio'
				name={name}
				id={`${name}_${id}`}
				value={value}
				className='hidden peer'
				onChange={onChange}
				defaultChecked={value === defaultCheckedValue}
			/>
			<label
				htmlFor={`${name}_${id}`}
				className='flex flex-row items-center gap-x-1 font-bold rounded-lg drop-shadow-md px-4 py-2 bg-neutral-200 dark:bg-slate-400 fill-susan-blue-100 peer-checked:text-slate-50 peer-checked:bg-susan-blue-100 peer-checked:fill-slate-50'
			>
				<span>{imageComponent}</span>
				{displayText}
			</label>
		</div>
	);
};

export default TileRadioButton;
