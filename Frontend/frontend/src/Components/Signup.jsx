import React from 'react'

const Signup = () => {
  return (
    <div className=''>
        <h1>SignUp</h1>
      <form action="" className='flex flex-col'>
        <label for="username" >username</label>
        <input type="text" placeholder='username' name='username' className='w-full mb-4 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-black placeholder:text-black/60 focus:outline-none focus:ring-2 focus:ring-pink-400'/>

        <label for="email">email</label>
        <input type="email" placeholder='email' name='email' />

        <label for="password">password</label>
        <input type="password" placeholder='Password' name='password' />

        <button type='submit'>SignUp</button>
      </form> 
    </div>
  )
}

export default Signup
