'use client';

import { useState, useEffect } from 'react';
import { MdBookmarkAdd } from 'react-icons/md';
import { useSession } from 'next-auth/react';

export default function BookmarkButton({ blogId }) {
	const { data: session } = useSession();
	const [bookmarked, setBookmarked] = useState(false);

	useEffect(() => {
		const fetchBookmarkStatus = async () => {
			if (!session?.user?.mongoId) return;
			try {
				const res = await fetch(
					`/api/bookmarks/bookmarkStatus?blogId=${blogId}&userId=${session.user.mongoId}`
				);
				const { hasBookmarked } = await res.json();
				setBookmarked(hasBookmarked);
			} catch (error) {
				console.error('Failed to fetch bookmark status:', error);
			}
		};
		fetchBookmarkStatus();
	}, [blogId, session?.user?.mongoId]);

	const handleBookmark = async () => {
		if (!session?.user?.mongoId) return;

		try {
			const url = bookmarked
				? `/api/bookmarks/removeBookmark?blogId=${blogId}&userId=${session.user.mongoId}`
				: `/api/bookmarks/doBookmark?blogId=${blogId}&userId=${session.user.mongoId}`;

			const method = bookmarked ? 'DELETE' : 'POST';
			const res = await fetch(url, { method });

			if (res.ok) {
				setBookmarked(!bookmarked);
			}
		} catch (error) {
			console.error('Error toggling bookmark:', error);
		}
	};

	return (
		<MdBookmarkAdd
			className={`cursor-pointer h-6 w-6 ${
				bookmarked ? 'ctxtColor' : 'text-slate-400'
			}`}
			onClick={handleBookmark}
		/>
	);
}
