import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import './index.css';

import Prioriza from './Prioriza';
import CadastrarAcao from './Pages/Acao/CadastrarAcao';
import EditarAcao from './Pages/Acao/EditarAcao';

localStorage.setItem('pesos', JSON.stringify({ iest: 0.556, iset: 0.244, ifin: 0.155, igov: 0.043 }));

const routes = [
    { path: '/prioriza', element: <Prioriza /> },

    { path: '/prioriza/cadastrar', element: <CadastrarAcao /> },
    { path: '/prioriza/:id/editar', element: <EditarAcao /> },
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
