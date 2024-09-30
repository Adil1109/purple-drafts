export default function Button({
	title,
	submissionLoading,
	submissionLoadingText,
	classAttr,
	typeAttr,
	children,
	onClick,
}) {
	return (
		<button
			className={`px-6 py-3 text-white text-base font-medium cbgColor
         disabled:bg-[#989DBB] ${classAttr}`}
			type={typeAttr ? typeAttr : 'button'}
			disabled={submissionLoading}
			onClick={onClick && onClick}>
			{children && children}
			{submissionLoading ? submissionLoadingText : title}
		</button>
	);
}
