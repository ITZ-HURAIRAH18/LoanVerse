import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from './router';
import axiosInstance from './axiosfile/axios';

function App() {
  useEffect(() => {
    // Fetch CSRF token on app mount
    axiosInstance.get('/csrf/').catch(err => console.log('CSRF token fetch:', err));
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
