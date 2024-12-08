import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function BlogCard({ blog }) {
	const router = useRouter();
	const pathname = usePathname();
	return (
		<div className='card md:w-96 w-full bg-slate-800 shadow-xl'>
			{blog?.thumbnailURL && (
				<figure>
					<Image
						width={600}
						height={600}
						src={
							'https://damsoncloud.com/wp-content/uploads/2021/05/17-1024x576.jpg'
						}
						alt={blog?.title}
						className='object-cover h-48 w-full'
					/>
				</figure>
			)}
			<div className='card-body glass bg-black'>
				<h2 className='card-title'>{blog?.title}</h2>
				{blog?.description && <p>{blog?.shortDescription}</p>}
				{pathname.includes('/admin-controls') && (
					<div className='card-actions justify-end'>
						<button
							className='btn btn-secondary'
							onClick={() =>
								router.push(`/admin-controls/blogs/update/${blog._id}`)
							}>
							Edit
						</button>
						<button
							className='btn btn-primary'
							onClick={() =>
								router.push(`/admin-controls/blogs/delete/${blog._id}`)
							}>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
