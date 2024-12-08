'use client';
import styles from './checkbox.css';

const Checkbox = ({
	label,
	value,
	name,
	_id,
	required,
	error,
	disabled,
	checked,
	onChange,
	...props
}) => {
	return (
		<div className='w-auto'>
			<div className={styles.checkbox}>
				<input
					type='checkbox'
					name={name}
					_id={_id}
					value={value}
					onChange={onChange}
					className={styles.checkboxInput}
					disabled={disabled}
					required={required}
					checked={checked}
					{...props}
				/>
				<label htmlFor={_id} className={styles.checkboxLabel}>
					{label}
				</label>
			</div>
		</div>
	);
};
export default Checkbox;
