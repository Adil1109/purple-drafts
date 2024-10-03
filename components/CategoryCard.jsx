import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function CategoryCard({ category }) {
	const router = useRouter();
	return (
		<div className='card md:w-96 w-full bg-slate-800 shadow-xl'>
			{category?.thumbnailURL && (
				<figure>
					<Image
						width={600}
						height={600}
						src={category?.thumbnailURL}
						alt={category?.name}
						className='object-cover h-48 w-full'
					/>
				</figure>
			)}
			<div className='card-body'>
				<h2 className='card-title'>{category?.name}</h2>
				{category?.description && <p>{category?.description}</p>}
				<div className='card-actions justify-end'>
					<button
						className='btn btn-secondary'
						onClick={() =>
							router.push(`/admin-controls/categories/update/${category._id}`)
						}>
						Edit
					</button>
					<button
						className='btn btn-primary'
						onClick={() =>
							router.push(`/admin-controls/categories/delete/${category._id}`)
						}>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
