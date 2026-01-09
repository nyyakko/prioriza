import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import Button from '../../../Components/Button';
import { Table, Column } from '../../../Components/Table';
import type { Company } from '../../../Persistence/Entities/Company';

import * as CompanyRepository from '../../../Repositories/Company/CompanyRepository';

export default function MyStocks()
{
    const navigate = useNavigate();

    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        CompanyRepository.getAll().then(setCompanies);
    }, [companies]);

    const onCreate = () => navigate('/prioriza/cadastrar');
    const onEdit = (company: Company) => navigate(`/prioriza/${company.id}/editar`);

    return (
        <section className='flex flex-col gap-4 pt-4'>
            <Button title='Cadastrar Ação' icon={faPlus} className='w-fit h-12 rounded-md px-4 py-4 items-center' onClick={onCreate}/>
            <section className='flex flex-1 w-full'>
                <Table data={companies} onRowClick={onEdit} className='max-h-90 2xl:max-h-140 w-full'>
                    <Column field='bias' header='Viés' />
                    <Column field='name' header='Empresa' />
                    <Column field='stock.ticker' header='Ticker' />
                    <Column field='stock.price.formatted' header='Cotação' />
                </Table>
            </section>
        </section>
    );
}
