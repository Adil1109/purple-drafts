'use client';
import './styles.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Toolbar from './Toolbar';
import Underline from '@tiptap/extension-underline';
import Document from '@tiptap/extension-document';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';

const Tiptap = ({ onChange, content, description }) => {
	const handleChange = (newContent) => {
		onChange(newContent);
	};
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			// Document,
			// Heading.configure({
			// 	levels: [1, 2, 3],
			// }),
			// Paragraph,
			// Text,
			// OrderedList,
			// ListItem,
		],
		editorProps: {
			attributes: {
				class:
					'flex flex-col px-4 py-3 justify-start min-h-80 border-b border-r border-l border-gray-300 text-slate-100 items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none',
			},
		},
		onUpdate: ({ editor }) => {
			handleChange(editor.getHTML());
		},
	});

	return (
		<div className='w-full mt-6'>
			<Toolbar editor={editor} content={content} description={description} />
			<EditorContent style={{ whiteSpace: 'pre-line' }} editor={editor} />
		</div>
	);
};

export default Tiptap;
