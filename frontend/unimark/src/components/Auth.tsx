import { LockClosedIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Axios } from '../lib/axios';
import { AxiosResponse, AxiosError } from 'axios';
import Cookie from 'universal-cookie';

import token from '../json/token.json';

type TOKEN = typeof token;
const cookie = new Cookie();

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const login = async () => {
    console.log(`${process.env.NEXT_PUBLIC_FRONTEND_URL}`);
    console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    await Axios.post(`api/proxy/authorize`, {
      email: email,
      password: password,
    })
      .then((res: AxiosResponse<TOKEN[]>) => {
        const { data, status } = res;
        console.log(data);
        console.log(status);
        if (status === 400) {
          throw 'authentication faild';
        } else if (status === 200) {
          console.log(res);
          const options = { path: '/' };
          cookie.set('access_token', res.data, options);
          router.push('/main');
        } else {
          alert('error');
        }
      })
      .catch((e: AxiosError<{ error: string }>) => {
        console.log(e.message);
        alert(e.message);
      });
  };

  const authUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign in to your account
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={authUser}>
          <input type='hidden' name='remember' defaultValue='true' />
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Email address'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remember-me'
                name='remember-me'
                type='checkbox'
                className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
              />
              <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500'>
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <LockClosedIcon
                  className='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                  aria-hidden='true'
                />
              </span>
              {isLogin ? 'Login' : 'Create new User'}
            </button>
          </div>

          <div>
            <div
              onClick={() => setIsLogin(!isLogin)}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
