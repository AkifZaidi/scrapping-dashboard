import './App.css';
import Adminpanel from './components/adminpanel';
import Login from './components/login';
import Register from './components/createUser';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Userpanel from './components/userpanel';
import CreateUser from './components/createUser';
import User from './components/user';
import Scrapper from './components/scrapper';
import ProtectedWrapper from "./components/ProtectedWrapper"
import CarManager from './components/CarManager';
import ScrapperList from './components/scrapperList';
import GetNumber from './components/GetNumber';
// import GetNumber from './components/GetNumber';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/adminpanel/*' element={<ProtectedWrapper><Adminpanel /></ProtectedWrapper>} >
            <Route path='createUser' element={<CreateUser />} />
            <Route path='user' element={<User />} />
            <Route path='scrapper' element={<Scrapper />} />
          </Route>
          <Route path='/userpanel' element={<Userpanel />} >
            <Route path='CarManager/GetNumber' element={<GetNumber/>} />
            <Route path='scrapperList' element={<ScrapperList/>} />
            {/* <Route path='GetNumber' element={<GetNumber/>} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
