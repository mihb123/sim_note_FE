const config = {
  PAGE_SIZE: import.meta.env.VITE_PAGE_SIZE || 30,
  API_HOST: import.meta.env.VITE_API_HOST || 'http://localhost:8000'
}

export default config;