import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import DrinkCard from './views/Drinks';
import History from './views/History';
import DrinksManagement from './views/DrinksManagement';
import ProtectedLayout from './components/ProtectedLayout';
import UserManagement from './views/UserManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/drinks' element={<DrinkCard />} />
        <Route path='/history' element={<History />} />
        <Route element={<ProtectedLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/admin/users' element={<UserManagement />} />
          <Route path='/admin/stock' element={<DrinksManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
