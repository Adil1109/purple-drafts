import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button className='btn bg-slate-700 text-white text-md' disabled={pending}>
			{pending ? 'Submitting...' : 'Submit'}
		</button>
	);
}
