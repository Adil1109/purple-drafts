'use client';

import { BiBold } from 'react-icons/bi';
import { BiItalic } from 'react-icons/bi';
import { MdFormatStrikethrough } from 'react-icons/md';
import { FaUnderline } from 'react-icons/fa6';
import { LuHeading2 } from 'react-icons/lu';
import { FaListUl } from 'react-icons/fa6';
import { LiaListOlSolid } from 'react-icons/lia';
import { FaQuoteLeft } from 'react-icons/fa';
import { MdUndo } from 'react-icons/md';
import { IoMdRedo } from 'react-icons/io';
import { IoCode } from 'react-icons/io5';
import { useEffect } from 'react';

const Toolbar = ({ editor, content, description }) => {
	useEffect(() => {
		editor && editor.commands.setContent(description);
	}, [description, editor]);
	if (!editor) {
		return null;
	}

	return (
		<div
			className='px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-center
    gap-5 w-full flex-wrap border border-gray-300'>
			<div className='flex justify-start items-center gap-5 w-full lg:w-10/12 flex-wrap '>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().toggleBold().run();
					}}
					className={
						editor.isActive('bold')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor'
					}>
					<BiBold className='w-5 h-5' />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().toggleItalic().run();
					}}
					className={
						editor.isActive('italic')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor'
					}>
					<BiItalic className='w-5 h-5' />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().toggleUnderline().run();
					}}
					className={
						editor.isActive('underline')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor'
					}>
					<FaUnderline className='w-5 h-5' />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().toggleStrike().run();
					}}
					className={
						editor.isActive('strike')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor'
					}>
					<MdFormatStrikethrough className='w-5 h-5' />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().toggleHeading({ level: 2 }).run();
					}}
					className={
						editor.isActive('heading', { level: 2 })
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor'
					}>
					<LuHeading2 className='w-5 h-5' />
				</button>

				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().toggleBulletList().run();
					}}
					className={
						editor.isActive('bulletList')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor'
					}>
					<FaListUl className='w-5 h-5' />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().toggleOrderedList().run();
					}}
					className={
						editor.isActive('orderedList')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor'
					}>
					<LiaListOlSolid className='w-5 h-5' />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().toggleBlockquote().run();
					}}
					className={
						editor.isActive('blockquote')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor'
					}>
					<FaQuoteLeft className='w-5 h-5' />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().setCode().run();
					}}
					className={
						editor.isActive('code')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor'
					}>
					<IoCode className='w-5 h-5' />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().undo().run();
					}}
					className={
						editor.isActive('undo')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor hover:cbgColor hover:text-white p-1 hover:rounded-lg'
					}>
					<MdUndo className='w-5 h-5' />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						editor.chain().focus().redo().run();
					}}
					className={
						editor.isActive('redo')
							? 'cbgColor text-white p-2 rounded-lg'
							: 'ctxtColor hover:cbgColor hover:text-white p-1 hover:rounded-lg'
					}>
					<IoMdRedo className='w-5 h-5' />
				</button>
			</div>
		</div>
	);
};

export default Toolbar;
