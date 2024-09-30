import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';
import MenuItem from '@/components/MenuItem';
import { FaUserPlus } from 'react-icons/fa';
import { FiFilePlus } from 'react-icons/fi';
import { LuBookPlus } from 'react-icons/lu';
import MsgShower from '@/components/MsgShower';
import { RiAdminFill } from 'react-icons/ri';
import { MdLibraryAdd } from 'react-icons/md';
import { IoIosPeople } from 'react-icons/io';
import { GiBookshelf } from 'react-icons/gi';
import { HiLibrary } from 'react-icons/hi';
import { CgPlayListAdd } from 'react-icons/cg';
import { FaLink, FaPeopleRoof } from 'react-icons/fa6';
import { MdEditNote } from 'react-icons/md';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { MdSpaceDashboard } from 'react-icons/md';
import { MdDashboardCustomize } from 'react-icons/md';
import { BiSolidDonateHeart } from 'react-icons/bi';

import CountUpdater from '@/components/CountUpdater';

export default async function AdminControls() {
	const session = await getServerSession(authOptions);

	if (session?.user?.role === 'admin' || session?.user?.role === 'superAdmin') {
		return (
			<div className='mx-auto ml-8'>
				<h2 className='py-4 font-bold text-2xl text-white'>Controls</h2>
				<div className='py-4 flex flex-wrap justify-evenly last:justify-stretch'>
					{session?.user?.role === 'superAdmin' && (
						<Link href={'/admin-controls/main-dashboard'}>
							<MenuItem Icon={MdSpaceDashboard} Title={'Main Dashboard'} />
						</Link>
					)}
					{session?.user?.role === 'superAdmin' && (
						<Link href={'/admin-controls/courses/dashboard'}>
							<MenuItem
								Icon={MdDashboardCustomize}
								Title={'Course Dashboard'}
							/>
						</Link>
					)}
					{session?.user?.role === 'superAdmin' && (
						<Link href={'/admin-controls/adminCreateDelete'}>
							<MenuItem Icon={RiAdminFill} Title={'Manage Admins'} />
						</Link>
					)}
					{session?.user?.role === 'superAdmin' && (
						<Link href={'/admin-controls/courseTransactions'}>
							<MenuItem
								Icon={FaMoneyBillTransfer}
								Title={'Course Transactions'}
							/>
						</Link>
					)}
					{session?.user?.role === 'superAdmin' && (
						<Link href={'/admin-controls/update-distributed-donation'}>
							<MenuItem
								Icon={BiSolidDonateHeart}
								Title={'Update Distributed Donation'}
							/>
						</Link>
					)}

					<Link href={'/admin-controls/course/create'}>
						<MenuItem Icon={MdLibraryAdd} Title={'New Course'} />
					</Link>
					<Link href={'/admin-controls/courses'}>
						<MenuItem Icon={HiLibrary} Title={'Edit Courses'} />
					</Link>
					<Link href={'/admin-controls/playlist/create'}>
						<MenuItem Icon={CgPlayListAdd} Title={'Create Playlist'} />
					</Link>
					<Link href={'/admin-controls/playlist/allPlaylists'}>
						<MenuItem Icon={MdEditNote} Title={'Edit Playlists'} />
					</Link>
					<Link href={'/admin-controls/url-shortner'}>
						<MenuItem Icon={FaLink} Title={'URL Shortner'} />
					</Link>
					<Link href={'/admin-controls/subject/create'}>
						<MenuItem Icon={LuBookPlus} Title={'Create Subject'} />
					</Link>

					<Link href={'/admin-controls/chapter/create'}>
						<MenuItem Icon={FiFilePlus} Title={'Create Chapter'} />
					</Link>
					<Link href={'/admin-controls/teacher/create'}>
						<MenuItem Icon={FaUserPlus} Title={'New Teacher'} />
					</Link>
					<Link href={'/admin-controls/allUsers'}>
						<MenuItem Icon={FaPeopleRoof} Title={'All Users'} />
					</Link>
					<Link href={'/admin-controls/allTeachers'}>
						<MenuItem Icon={IoIosPeople} Title={'All Teachers'} />
					</Link>
					<Link href={'/admin-controls/subjects'}>
						<MenuItem Icon={GiBookshelf} Title={'Sub/Chapters'} />
					</Link>
				</div>
			</div>
		);
	}
	return <MsgShower msg='You are not Authorized!' />;
}
