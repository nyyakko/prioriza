import { faBullhorn, faChartLine, faChessKnight, faIndustry, faWallet } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import Button from '../../Components/Button';
import Estrategico from './Etapas/Estrategico';
import Financeiro from './Etapas/Financeiro';
import Geral from './Etapas/Geral';
import Governanca from './Etapas/Governanca';
import Setorial from './Etapas/Setorial';
import Steps from '../../Components/Steps';
import type { Empresa } from '../../Entities/Empresa';
import type { Pesos } from '../../Entities/Pesos';

import calcularViablidade from '../../Utils/calcularViabilidade';

export default function CadastrarAcao()
{
    const navigate = useNavigate();

    const pesos = JSON.parse(localStorage.getItem('pesos')!) as Pesos;
    const [success, setSucesso] = useState(false);
    const [empresa, setEmpresa] = useState<Empresa>({
        nome: '',
        indicadores: { ifin: [], iset: [], iest: [], igov: [] },
        preferencia: 0,
        acao: {
            ticker: '',
            cotacao: { float: 0, formatted: '', value: '' }
        },
    });

    const [activeIndex, setActiveIndex] = useState(0);

    const steps = [
        {
            label: 'Dados Gerais',
            icon: faWallet,
            element: <Geral empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
        {
            label: 'Dados Financeiros',
            icon: faChartLine,
            element: <Financeiro empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
        {
            label: 'Dados do Setor',
            icon: faIndustry,
            element: <Setorial empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
        {
            label: 'Dados de Estratégia',
            icon: faChessKnight,
            element: <Estrategico empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
        {
            label: 'Dados de Governança',
            icon: faBullhorn,
            element: <Governanca empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
    ];

    const onCreate = () => {
        const empresas = JSON.parse(localStorage.getItem('empresas') ? localStorage.getItem('empresas')! : '[]') as Empresa[];
        empresa.preferencia = calcularViablidade(empresa, pesos);
        localStorage.setItem('empresas', JSON.stringify([ ...empresas, empresa ]));
        navigate('/prioriza');
    };

    const onCancel = () => navigate('/prioriza');

    return (
        <div className='flex flex-col items-center py-4 gap-4 h-screen'>
            <section className='w-[60%] 2xl:w-[50%] bg-background dark:bg-background-dark rounded-lg px-6 py-4 flex justify-center'>
                <h1 className='text-accent dark:text-accent-dark font-bold text-xl'>Prioriza</h1>
            </section>
            <section className='w-[60%] 2xl:w-[50%] bg-background dark:bg-background-dark rounded-lg flex flex-col gap-4 p-4'>
                <h1 className='text-accent dark:text-accent-dark font-bold text-xl pb-4'>Cadastrar Ação</h1>
                <section className='flex flex-col gap-4'>
                    <Steps items={steps} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                </section>
                <section className='flex flex-row justify-between'>
                    <Button title='Cancelar' className='w-20 rounded-md px-4 py-3' onClick={onCancel} />
                    <section className='flex flex-row gap-2'>
                        <Button title='Voltar' className='w-30 rounded-md px-4 py-3' onClick={() => setActiveIndex(activeIndex-1)} disabled={activeIndex === 0} />
                        {
                            activeIndex === steps.length-1
                                ? <Button title='Concluir' className='w-30 rounded-md px-4 py-3' onClick={onCreate} disabled={!success} />
                                : <Button title='Próximo' className='w-30 rounded-md px-4 py-3' onClick={() => setActiveIndex(activeIndex+1)} disabled={!success} />
                        }
                    </section>
                </section>
            </section>
        </div>
    );
}
