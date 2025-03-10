'use client';

import Link from 'next/link';

export default function StudyButton({
	LinkProp,
	Heading,
	SubHeading,
	BtnTitle,
	isInternel,
}) {
	return (
		<>
			<div className='mx-7 card smd:w-[90%] w-[50%] ssm:w-[90%] bg-primary text-primary-content'>
				{LinkProp && (
					<div className='card-body !bg-base-100 text-white'>
						<h2 className='card-title'>{Heading}</h2>
						<p>{SubHeading}</p>
						<div className='card-actions justify-end'>
							<Link
								href={LinkProp}
								target={isInternel == true ? '' : '_blank'}
								className='btn cbgColor text-white'>
								{BtnTitle}
							</Link>
						</div>
					</div>
				)}
			</div>
		</>
	);
}
