'use client';

import MsgShower from '@/components/MsgShower';
import BlogCard from '@/components/BlogCard';

export default function RecentBlogs({ blogs }) {
	return (
		<div className=''>
			<p className='py-6 underline italic text-center text-2xl'>
				Recently Added
			</p>
			<div className='flex px-6 pt-2 pb-6 gap-5 flex-wrap w-full justify-center'>
				{!blogs ? (
					<MsgShower msg={'No Blogs available!'} />
				) : (
					blogs?.map((item) => {
						return <BlogCard key={item._id} blog={item} />;
					})
				)}
			</div>
		</div>
	);
}
