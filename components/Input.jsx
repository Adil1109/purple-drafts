import { MdErrorOutline } from 'react-icons/md';

export default function Input({
	labelAttr,
	typeAttr,
	nameAttr,
	classAttr,
	placeholderAttr,
	requiredAttr,
	errorAttr,
	leftIconAttr,
	rightIconAttr,
	...props
}) {
	return (
		<label className='form-control'>
			{labelAttr && (
				<div className='label !px-0'>
					<span className='label-text !text-oc-black-secondary'>
						{labelAttr}
					</span>
				</div>
			)}
			<div className='relative'>
				<input
					className={`block text-oc-black-primary placeholder:text-sm placeholder:text-[#989DBB] focus:!ring-0 focus:shadow-oc-shadow-1 focus:border
           focus:border-oc-primary px-4 py-3 ${classAttr} ${
						errorAttr
							? 'shadow-oc-shadow-2 border border-oc-red focus:shadow-oc-shadow-2 focus:border focus:border-oc-red'
							: ''
					}`}
					type={typeAttr}
					name={nameAttr}
					placeholder={placeholderAttr}
					required={requiredAttr}
					minLength={3}
					{...props}
				/>
				<span className='absolute z-[2] top-1/2 -translate-y-1/2 text-oc-black-primary left-4'>
					{leftIconAttr && leftIconAttr}
				</span>
				<span className='absolute z-[2] top-1/2 -translate-y-1/2 text-oc-black-primary end-4'>
					{rightIconAttr && rightIconAttr}
				</span>
			</div>
			{errorAttr && (
				<div className='label !px-0'>
					<span className='label-text !text-oc-red'>
						<MdErrorOutline className='inline me-2' />
						{errorAttr}
					</span>
				</div>
			)}
		</label>
	);
}
