import logo from './logo.svg';
import './App.css';
import {  Routes,
  Route,
} from "react-router-dom";
import { useState } from 'react';
import Dashboard from './Pages/Dashboard';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
function App() {
  const [user, setUser] = useState(null)

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard user={user} setUser={setUser}/>}></Route>
        <Route path='/login' element={<Login setUser={setUser}/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        
      </Routes>
    </div>
  );
}

export default App;
