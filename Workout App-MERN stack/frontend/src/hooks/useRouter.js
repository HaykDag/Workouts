import {createBrowserRouter, createRoutesFromElements, Navigate, Route } from 'react-router-dom'
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import User from '../pages/User';
import PublicWorkouts from '../pages/PublicWorkouts';

import { useAuthContext } from './useAuthContext';

const MyRouter = ()=>{
        const {user} = useAuthContext();
        const router = createBrowserRouter(
            createRoutesFromElements(
              <>
              <Route path='/' element={user?<Home/>:<Navigate to='/login' />} />
              <Route path='/signup/' element={user?<Navigate to="/"/>:<Signup/>}/>
              <Route path='/login/' element={user?<Navigate to="/"/>:<Login/>}/>
              <Route path='/public/' element={<PublicWorkouts />}/>
              <Route path='/:email' element={<User />} />
              </>
            )
          )
     return router;
}

export default MyRouter;