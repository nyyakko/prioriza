import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

import Button from './Components/Button';
import Table from './Components/Table';
import Column from './Components/Column';
import type { Empresa } from './Entities/Empresa';

type Acao = { nome: string, ticker: string, cotacao: string, preferencia: string };

export default function MinhasAcoes()
{
    const navigate = useNavigate();

    const empresas: Empresa[] = JSON.parse(localStorage.getItem('empresas')!) as Empresa[] || [];

    const acoes: Acao [] =
        empresas.map(empresa => {
            return {
                nome: empresa.nome,
                ticker: empresa.acao.ticker,
                cotacao: empresa.acao.cotacao.formatted,
                preferencia: `${empresa.preferencia}%`
            };
        });

    const onNewAcao = () => navigate('/cadastrar');
    const onEditAcao = (_: Acao, index: number) => navigate(`/${index}/editar`);

    return (
        <section className='flex flex-col justify-between gap-4 pt-4'>
            <Button title='Cadastrar Ação' icon={faPlus} className='w-fit h-12 rounded-md px-4 py-4 items-center' onClick={onNewAcao}/>
            <Table data={acoes} onRowClick={onEditAcao} className='max-h-100'>
                <Column field='preferencia' header='Viés' />
                <Column field='nome' header='Empresa' />
                <Column field='ticker' header='Ticker' />
                <Column field='cotacao' header='Cotação' />
            </Table>
        </section>
    );
}
