/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState } from 'react';
import { MdCloudUpload } from 'react-icons/md';

const FileInput = ({
	nameAttr,
	requiredAttr,
	selectedFile,
	setSelectedFile,
}) => {
	const handleFileChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = function (e) {
					setSelectedFile(e.target.result);
				};

				reader.readAsDataURL(file);
			} else {
				alert('Please select a valid image file.');
			}
		} else {
			setSelectedFile(null);
		}
	};

	return (
		<div>
			<label
				htmlFor={nameAttr}
				className='flex flex-col items-center justify-center w-full h-48 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer !bg-base-300'>
				{selectedFile ? (
					<div>
						<img
							src={selectedFile}
							alt='Preview'
							className='w-48 rounded-lg shadow-sm shadow-black'
						/>
					</div>
				) : (
					<div className='flex flex-col items-center justify-center pt-5 pb-6'>
						<MdCloudUpload className='w-12 h-12' />
						<p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
							<span className='font-semibold'>Click to upload</span>
						</p>
					</div>
				)}
				<input
					id={nameAttr}
					type='file'
					className='sr-only'
					required={requiredAttr}
					accept='image/png, image/jpeg'
					onChange={handleFileChange}
					name={nameAttr}
				/>
			</label>
		</div>
	);
};

export default FileInput;
