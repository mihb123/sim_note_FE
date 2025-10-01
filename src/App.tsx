export default function App() {
  const Logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  };

  return (
    <>
      <h1>Welcome to SimNote</h1>
      <button onClick={Logout} className='btn btn-primary hover:bg-blue-700 hover:text-white hover:cursor-pointer'>Logout</button>
    </>
  );
}