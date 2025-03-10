import { FiUser } from 'react-icons/fi';
import Image from 'next/image';
import { formatReadableDateTime } from '@/lib/formatTime';
import BlogCard from '@/components/BlogCard';
import SeeComments from '@/components/SeeComments';
import Loader from '@/components/Loader';
import BookmarkButton from '@/components/BookmarkButton';

const fetchBlog = async (blogId) => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/allBlogs/getBlogById?blogId=${blogId}`,
		{
			next: { revalidate: 60 },
		}
	);
	if (!res.ok) return null;
	const data = await res.json();
	return data.blog;
};

const fetchSuggestedBlogs = async (blogId) => {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/api/allBlogs/getSuggestedBlogs?blogId=${blogId}`,
		{
			next: { revalidate: 60 },
		}
	);
	if (!res.ok) return [];
	const data = await res.json();
	return data.blogs;
};

export default async function BlogDetails({ params }) {
	const { blogId } = await params;
	const blog = await fetchBlog(blogId);
	const suggestedBlogs = await fetchSuggestedBlogs(blogId);

	if (!blog) {
		return <Loader />;
	}

	return (
		<main>
			<div className='py-8 lg:py-12 px-7'>
				<div className='mb-7'>
					<h4 className='text-base font-bold text-oc-primary mb-4'>Blog</h4>
					<h1 className='h1'>{blog.title}</h1>
					<span className='flex w-[60px] h-1 bg-oc-gray my-4'></span>
					<div className='flex justify-between items-center border-b border-slate-700 pb-2'>
						<p className='flex items-center gap-2 text-xs '>
							<FiUser className='inline' /> Purple Drafts
							<span className='text-lg'>•</span>
							{formatReadableDateTime(blog.createdAt)}
						</p>
						<BookmarkButton blogId={blogId} />
					</div>
				</div>

				<div className='grid grid-cols-12 gap-7'>
					<div className='col-span-12 md:col-span-7 lg:col-span-8'>
						<Image
							height={400}
							width={600}
							className='w-full aspect-w-16 aspect-h-9'
							src={blog.thumbnailURL}
							alt={blog.title || 'Blog thumbnail'}
						/>
						<p className='flex items-center gap-2 text-xs my-2'>
							Image: Internet
						</p>
						<div
							dangerouslySetInnerHTML={{ __html: blog.description }}
							className='flex flex-col gap-3 text-base'></div>

						<hr className='mt-4' />
						<div className='flex flex-wrap gap-4 mt-4'>
							<span className='bg-base-200 py-2.5 px-5 text-oc-primary text-sm'>
								Blog
							</span>
							<span className='bg-base-200 py-2.5 px-5 text-oc-primary text-sm'>
								PurpleDrafts
							</span>
							<span className='bg-base-200 py-2.5 px-5 text-oc-primary text-sm'>
								SEO
							</span>
						</div>

						<SeeComments RefModel='Blog' ContentID={blogId} />
					</div>

					<div className='col-span-12 md:col-span-8 lg:col-span-4'>
						<h2 className='h2 mb-4'>Explore more</h2>
						<div className='flex flex-col gap-4'>
							{suggestedBlogs.map((item) => (
								<BlogCard key={item._id} blog={item} />
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
