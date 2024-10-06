import './App.css';
import Adminpanel from './components/adminpanel';
import Login from './components/login';
import Register from './components/createUser';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Userpanel from './components/userpanel';
import CreateUser from './components/createUser';
import User from './components/user';
import Scrapper from './components/scrapper';
import ScrapperList from './components/scrapperList';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/adminpanel' element={<Adminpanel />} >
            <Route path='createUser' element={<CreateUser />} />
            <Route path='user' element={<User />} />
          </Route>
          <Route path='/userpanel' element={<Userpanel />} >
            <Route path='scrapper' element={<Scrapper />} />
            <Route path='scrapperList' element={<ScrapperList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
