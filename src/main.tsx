import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import './Persistence/Database';
import './Persistence/Migration';

import Home from './Pages/Home/Home';
import RegisterStock from './Pages/Stock/RegisterStock';
import EditStock from './Pages/Stock/EditStock';

import './index.css';

// localStorage.setItem('weights', JSON.stringify({ iest: 0.556, iset: 0.244, ifin: 0.155, igov: 0.043 }));
// localStorage.setItem('weights', JSON.stringify({ iest: 0.505, iset: 0.259, ifin: 0.194, igov: 0.040 }));
localStorage.setItem('weights', JSON.stringify({ iest: 0.474, iset: 0.257, ifin: 0.224, igov: 0.043 }));

const routes = [
    { path: '/prioriza', element: <Home /> },
    { path: '/prioriza/cadastrar', element: <RegisterStock /> },
    { path: '/prioriza/:id/editar', element: <EditStock /> },
];

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
        {
            routes.map(({ path, element }) =>
                <Route path={path} element={element} />
            )
        }
        </Routes>
    </BrowserRouter>
)
