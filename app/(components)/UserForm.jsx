'use client';


import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const UserForm = () => {
	const router = useRouter()
	const [formData, setFormData] = useState({});
	const [errorMessage, setErrorMessage] = useState();
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prevState => {
			return {
				...prevState,
				[name]: value
			}
		})
	}
	const handleSubmit = async(e) => {
		e.preventDefault();
		setErrorMessage('');
		const res = await fetch('/api/Users', {
			method: 'POST',
			body: JSON.stringify({formData}),
			'content-type': "application/json"
		});
		if(!res.ok) {
			const response = await res.json()
			setErrorMessage(response.message);
		}
		router.refresh();
		router.push('/');
	}
  return (
    <>
			<form
				onSubmit={handleSubmit}
				method='post'
				className='flex flex-col gap-3 w1/2'
			>
				<h1>Create New User</h1>
				<label>Full Name</label>
				<input 
					type='text' 
					name="name" 
					value={formData.name} 
					onChange={handleChange} 
					required={true}
					className='m-2 bg-slate-400 rounded'
				/>
				<label>Email</label>
				<input 
					type='text' 
					name="email" 
					value={formData.email} 
					onChange={handleChange} 
					required={true}
					className='m-2 bg-slate-400 rounded'
				/>
				<label>Password</label>
				<input 
					type='password' 
					name="password" 
					value={formData.password} 
					onChange={handleChange} 
					required={true}
					className='m-2 bg-slate-400 rounded'
				/>
				<input type='submit' value={'Create user'} className='bg-blue-300 hover:bg-blue-500' />
				<p className='text-red-500'>{errorMessage}</p>
			</form>
		</>
  )
}

export default UserForm;
