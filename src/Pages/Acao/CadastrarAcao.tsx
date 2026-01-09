import { faBullhorn, faChartLine, faChessKnight, faIndustry, faWallet } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Button from '../../Components/Button';
import IndicadorEstrategico from './Indicadores/IndicadorEstrategico';
import IndicadorFinanceiro from './Indicadores/IndicadorFinanceiro';
import IndicadorGovernanca from './Indicadores/IndicadorGovernanca';
import IndicadorSetorial from './Indicadores/IndicadorSetorial';
import InputField from '../../Components/InputField';
import Steps from '../../Components/Steps';
import { type Empresa } from '../../Entities/Empresa';
import InputCurrency from '../../Components/InputCurrency';
import Input from '../../Components/Input';

import calcularViablidade from '../../Utils/calcularViabilidade';
import type { Pesos } from '../../Entities/Pesos';

function DadosGerais({ empresa, setEmpresa, setSucesso }: {
    empresa: Empresa,
    setEmpresa: React.Dispatch<React.SetStateAction<Empresa>>
    setSucesso: React.Dispatch<React.SetStateAction<boolean>>
})
{
    const [cotacao, setCotacao] = useState<{ float: number, formatted: string, value: string }>(empresa.acao.cotacao);

    useEffect(() => setEmpresa({ ...empresa, acao: { ...empresa.acao, cotacao } }), [cotacao]);
    useEffect(() => setSucesso(empresa.nome.length > 0 && empresa.acao.ticker.length > 0 && empresa.acao.cotacao.float > 0), [empresa]);

    const onChange = (ticker: string) => setEmpresa({ ...empresa, acao: { ...empresa.acao, ticker } });

    return (
        <div className='flex flex-col gap-4'>
            <p className='text-base'>Registre as informações gerais da nova ação a ser cadastrada.</p>
            <InputField title='Empresa' field='nome' value={empresa} setValue={setEmpresa} />
            <section className='flex gap-4'>
                <Input title='Ticker' value={empresa.acao.ticker} onChange={onChange} className='flex-1' />
                <InputCurrency title='Cotação' value={cotacao} setValue={setCotacao} className='flex-1' />
            </section>
        </div>
    );
}

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
            element: <DadosGerais empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
        {
            label: 'Dados Financeiros',
            icon: faChartLine,
            element: <IndicadorFinanceiro empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
        {
            label: 'Dados do Setor',
            icon: faIndustry,
            element: <IndicadorSetorial empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
        {
            label: 'Dados de Estratégia',
            icon: faChessKnight,
            element: <IndicadorEstrategico empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
        {
            label: 'Dados de Governança',
            icon: faBullhorn,
            element: <IndicadorGovernanca empresa={empresa} setEmpresa={setEmpresa} setSucesso={setSucesso} />
        },
    ];

    const onCreate = () => {
        const empresas = JSON.parse(localStorage.getItem('empresas') ? localStorage.getItem('empresas')! : '[]') as Empresa[];
        empresa.preferencia = calcularViablidade(empresa, pesos);
        localStorage.setItem('empresas', JSON.stringify([ ...empresas, empresa ]));
        navigate('/');
    };

    const onCancel = () => navigate('/');

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
