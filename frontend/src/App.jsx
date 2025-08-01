import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router'; // 👈 Import the router file

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
