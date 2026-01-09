import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

import Button from '../../../Components/Button';
import Column from '../../../Components/Column';
import Table from '../../../Components/Table';
import type { Company } from '../../../Entities/Company';

export default function MyStocks()
{
    const navigate = useNavigate();

    const companies = JSON.parse(localStorage.getItem('companies')!) as Company[] || [];
    const stocks = companies.map(company => {
        return {
            company: company.name,
            ticker: company.stock.ticker,
            price: company.stock.price.formatted,
            bias: `${company.bias}%`
        };
    });

    const onCreate = () => navigate('/prioriza/cadastrar');
    const onEdit = (_: object, index: number) => navigate(`/prioriza/${index}/editar`);

    return (
        <section className='flex flex-col gap-4 pt-4'>
            <Button title='Cadastrar Ação' icon={faPlus} className='w-fit h-12 rounded-md px-4 py-4 items-center' onClick={onCreate}/>
            <section className='flex flex-1 w-full'>
                <Table data={stocks} onRowClick={onEdit} className='max-h-90 2xl:max-h-140 w-full'>
                    <Column field='bias' header='Viés' />
                    <Column field='company' header='Empresa' />
                    <Column field='ticker' header='Ticker' />
                    <Column field='price' header='Cotação' />
                </Table>
            </section>
        </section>
    );
}
