import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import Link from 'next/link';
import MenuItem from '@/components/MenuItem';
import { FaBlog, FaUserPlus } from 'react-icons/fa';
import { FiFilePlus } from 'react-icons/fi';
import { LuBookPlus } from 'react-icons/lu';
import MsgShower from '@/components/MsgShower';
import { RiAdminFill } from 'react-icons/ri';
import { MdCategory, MdLibraryAdd } from 'react-icons/md';
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

export default async function AdminControls() {
	const session = await getServerSession(authOptions);

	if (session?.user?.role === 'admin' || session?.user?.role === 'superAdmin') {
		return (
			<div className='mx-auto ml-8'>
				<h2 className='py-4 font-bold text-2xl text-white'>Controls</h2>
				<div className='py-4 flex flex-wrap justify-evenly last:justify-stretch'>
					{session?.user?.role === 'superAdmin' && (
						<Link href={'/admin-controls/adminCreateDelete'}>
							<MenuItem Icon={RiAdminFill} Title={'Manage Admins'} />
						</Link>
					)}

					<Link href={'/admin-controls/categories'}>
						<MenuItem Icon={MdCategory} Title={'Categories'} />
					</Link>
					<Link href={'/admin-controls/blogs'}>
						<MenuItem Icon={FaBlog} Title={'Blogs'} />
					</Link>

					<Link href={'/admin-controls/url-shortner'}>
						<MenuItem Icon={FaLink} Title={'URL Shortner'} />
					</Link>
				</div>
			</div>
		);
	}
	return <MsgShower msg='You are not Authorized!' />;
}
