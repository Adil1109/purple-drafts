'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import MsgShower from '@/components/MsgShower';
import ScrollMsg from '@/components/ScrollMsg';
import CourseCard from '@/components/CourseCard';
import { useParams } from 'next/navigation';
import AddCourseToStudent from '@/components/AddCourseToStudent';

export default function UserCourses() {
	const { status, data: session } = useSession();
	const [page, setPage] = useState(1);
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);
	const [uLoading, setULoading] = useState(false);
	const [user, setUser] = useState();
	const [error, setError] = useState('');
	const [end, setEnd] = useState(false);
	const mongoId = session?.user?.mongoId;
	const params = useParams();
	const decodedEmail = decodeURIComponent(params.byEmail || '');

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(
					`/api/user/getUser/byEmail?byEmail=${decodedEmail}`
				);

				const userData = await response.json();
				if (!response.ok) {
					setError(`${userData.error}`);
					return;
				}

				if (!userData) {
					setError('Data not received');
					return;
				}

				setUser(userData.user);
			} catch (error) {
				setError(`Error fetching data: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [decodedEmail]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const response = await fetch(
					`/api/enrolledCourses/byEmail?userEmail=${decodedEmail}&page=${page}`
				);

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const dataArr = await response.json();

				if (!dataArr.userEnrolledCourses.enrolledCourses) {
					setError(`You haven't enrolled yet!`);
					return;
				}

				if (dataArr.userEnrolledCourses.enrolledCourses.length < 1) {
					setEnd(true);
				}

				setCourses((prev) => [
					...prev,
					...dataArr.userEnrolledCourses.enrolledCourses,
				]);
			} catch (error) {
				setError(`Error fetching data: ${error.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [page, decodedEmail]);

	const handleScroll = () => {
		if (
			window.innerHeight + document.documentElement.scrollTop + 1 >=
			document.documentElement.scrollHeight
		) {
			if (!end) {
				setPage((prev) => prev + 1);
			}
		}
	};

	useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	});

	return (
		<div className='mx-auto  mr-4'>
			{uLoading ? (
				<Loader />
			) : (
				<div className='px-8 py-4 rounded-md flex flex-col gap-3 items-center'>
					<div className='self-end'>
						<AddCourseToStudent />
					</div>

					<Image
						className='rounded-full shadow-2xl'
						src={user?.image}
						width={100}
						height={100}
						alt='User Photo'
						placeholder='blur'
						blurDataURL='L02rs+~q9FRjj[j[ayfQfQfQfQfQ'
					/>

					<div>
						Name: <span className='font-bold'>{user?.name}</span>
					</div>
					<div>
						Email: <span className='font-bold ssm:text-sm'>{user?.email}</span>
					</div>

					<hr className='w-full border-slate-700' />
				</div>
			)}
			<div>
				<h2 className='pl-8 text-white font-bold text-lg'>Enrolled Courses</h2>
				<div className='flex px-7 py-2 flex-wrap w-full justify-stretch smd:justify-center'>
					{!courses ? (
						<MsgShower msg={'No Courses available!'} />
					) : (
						courses?.map((item) => {
							return (
								<CourseCard
									key={item._id}
									course={item}
									showButton={false}
									showDetails={false}
								/>
							);
						})
					)}
					{loading && <Loader className='self-center' />}
					{error && <ScrollMsg msg={error} />}
					{end && <ScrollMsg msg={'No further Courses!'} />}
				</div>
			</div>
		</div>
	);
}
