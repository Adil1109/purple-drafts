export default function ButtonOutline({
	title,
	submissionLoading,
	classAttr,
	children,
	onClick,
}) {
	return (
		<button
			className={`px-5 py-2.5 text-base font-medium bg-transparent
         disabled:bg-[#989DBB] border flex justify-center gap-2 ${classAttr}`}
			disabled={submissionLoading}
			onClick={onClick && onClick}>
			{children && children}
			{submissionLoading ? 'Submitting...' : title}
		</button>
	);
}
