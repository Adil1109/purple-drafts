'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function BlogCard({ blog }) {
	const router = useRouter();
	const pathname = usePathname();
	return (
		<Link
			href={`/blogs/view/${blog?._id}`}
			className='card md:w-96 sm:max-w-96 w-full bg-slate-800 shadow-xl rounded-lg overflow-hidden'>
			{blog?.thumbnailURL && (
				<figure>
					<Image
						width={600}
						height={400}
						src={blog.thumbnailURL}
						alt={blog?.title}
						className='object-cover h-48 w-full'
					/>
				</figure>
			)}

			<div className='card-body bg-slate-900 text-gray-100 p-5'>
				<h2 className='card-title text-lg font-bold hover:text-indigo-400 transition'>
					{blog?.title}
				</h2>

				{blog?.shortDescription && (
					<p className='mt-2 text-sm text-gray-300'>{blog?.shortDescription}</p>
				)}

				<div className='mt-3 text-xs text-gray-400'>
					{blog?.viewsCount} views
				</div>

				{pathname.includes('/admin-controls') && (
					<div className='card-actions justify-end mt-4'>
						<button
							className='btn btn-secondary btn-sm'
							onClick={() =>
								router.push(`/admin-controls/blogs/update/${blog._id}`)
							}>
							Edit
						</button>
						<button
							className='btn btn-primary btn-sm'
							onClick={() =>
								router.push(`/admin-controls/blogs/delete/${blog._id}`)
							}>
							Delete
						</button>
					</div>
				)}
			</div>
		</Link>
	);
}
