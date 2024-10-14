import { MdErrorOutline } from 'react-icons/md';

export default function DynamicSelect({
	labelAttr,
	classAttr,
	requiredAttr,
	errorAttr,
	placeholderAttr,
	optionsAttr,
	ds,
	...props
}) {
	return (
		<label className='form-control'>
			{labelAttr && (
				<div className='label !px-0'>
					<span className='label-text'>{labelAttr}</span>
				</div>
			)}
			<div className='relative'>
				<select
					className={`h-full block text-oc-black-primary placeholder:text-sm bg-slate-700 rounded-md placeholder:text-[#989DBB] focus:!ring-0 focus:shadow-oc-shadow-1 focus:border
           focus:border-oc-primary px-4 py-3 ${classAttr} ${
						errorAttr
							? 'shadow-oc-shadow-2 border border-oc-red focus:shadow-oc-shadow-2 focus:border focus:border-oc-red'
							: ''
					}`}
					required={requiredAttr}
					{...props}>
					{placeholderAttr && <option value=''>{placeholderAttr}</option>}
					{optionsAttr &&
						optionsAttr.map((item) => {
							return (
								<option value={item.id} key={item.id}>
									{item[ds]}
								</option>
							);
						})}
				</select>
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
