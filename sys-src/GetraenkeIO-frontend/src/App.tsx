import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import DrinkCard from './views/Drinks';
import ProtectedLayout from './components/ProtectedLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/drinks' element={<DrinkCard />} />
        <Route element={<ProtectedLayout />}>
          <Route path='/' element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
