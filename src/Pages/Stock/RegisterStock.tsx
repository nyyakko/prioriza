import { faBullhorn, faChartLine, faChessKnight, faIndustry, faWallet } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import Button from '../../Components/Button';
import Estrategico from './Steps/Strategic';
import Finantial from './Steps/Finantial';
import General from './Steps/General';
import Governance from './Steps/Governance';
import Sectoral from './Steps/Sectoral';
import Steps from '../../Components/Steps';
import type { Company } from '../../Persistence/Entities/Company';
import type { Weights } from '../../Persistence/Entities/Weights';

import * as CompanyRepository from '../../Repositories/Company/CompanyRepository';

import calculateBias from '../../Utils/calculateBias';

export default function RegisterStock()
{
    const navigate = useNavigate();

    const weights = JSON.parse(localStorage.getItem('weights')!) as Weights;

    const [activeIndex, setActiveIndex] = useState(0);
    const [company, setCompany] = useState<Company>({
        name: '',
        indices: { ifin: [], iset: [], iest: [], igov: [] },
        bias: 0,
        stock: {
            ticker: '',
            price: { float: 0, formatted: '', value: '' }
        },
    });

    const [success, setSucess] = useState(false);

    const steps = [
        {
            label: 'Dados Gerais',
            icon: faWallet,
            element: <General company={company} setCompany={setCompany} setSucess={setSucess} />
        },
        {
            label: 'Dados Financeiros',
            icon: faChartLine,
            element: <Finantial company={company} setCompany={setCompany} setSuccess={setSucess} />
        },
        {
            label: 'Dados do Setor',
            icon: faIndustry,
            element: <Sectoral company={company} setCompany={setCompany} setSuccess={setSucess} />
        },
        {
            label: 'Dados de Estratégia',
            icon: faChessKnight,
            element: <Estrategico company={company} setCompany={setCompany} setSuccess={setSucess} />
        },
        {
            label: 'Dados de Governança',
            icon: faBullhorn,
            element: <Governance company={company} setCompany={setCompany} setSuccess={setSucess} />
        },
    ];

    const onCancel = () => navigate('/prioriza');

    const onCreate = async () => {
        company.bias = calculateBias(company, weights);
        await CompanyRepository.create(company);
        navigate('/prioriza');
    };

    const onNext = () => setActiveIndex(activeIndex+1);

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
                                : <Button title='Próximo' className='w-30 rounded-md px-4 py-3' onClick={onNext} disabled={!success} />
                        }
                    </section>
                </section>
            </section>
        </div>
    );
}
