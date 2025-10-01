import { useAuthForm } from '@auth/hooks/useAuthForm';
import LoadingSpinner from '@auth/components/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const { fields, errors, handleChange, handleSubmit, isLoading } = useAuthForm('register');

  return (
    <div className="min-h-screen flex items-center justify-center">
      {isLoading && <LoadingSpinner />}
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-4" method="post">
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input id="full-name" name="name" type="text" value={fields.name} onChange={handleChange} placeholder="John Doe" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:text-white" />
            {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input id="email" name="email" type="email" value={fields.email} onChange={handleChange} placeholder="you@example.com" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:text-white" />
            {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input id="password" name="password" type="password" value={fields.password} onChange={handleChange} placeholder="Your Password" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:text-white" />
            {errors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <input id="password_confirmation" name="password_confirmation" type="password" value={fields.password_confirmation} onChange={handleChange} placeholder="Confirm Your Password" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm dark:text-white" />
            {errors.password_confirmation && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password_confirmation}</p>}
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sky-600 hover:underline dark:text-sky-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}