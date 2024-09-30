'use client';
import Loader from '@/components/Loader';
import StudyButton from '@/components/StudyButton';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Redirector() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const router = useRouter();

	const params = useParams();

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(
					`/api/allShortUrls/redirector?identifier=${params.identifier}`
				);

				if (!response.ok) {
					setError(true);
				} else {
					const data = await response.json();
					router.replace(data?.existingShortUrl?.shortUrl);
				}
			} catch (error) {
				setError(`Error fetching data: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [params, router]);

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<StudyButton
					LinkProp={'https://hsccrackers.com'}
					BtnTitle={'Home'}
					Heading={'Invalid Link'}
					SubHeading={'Go back to homepage!'}
				/>
			</div>
		);
	}

	return null;
}
