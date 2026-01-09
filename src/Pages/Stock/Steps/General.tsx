import { useEffect, useState } from 'react';

import InputCurrency from '../../../Components/InputCurrency';
import InputField from '../../../Components/InputField';
import Input from '../../../Components/Input';
import type { Company } from '../../../Persistence/Entities/Company';

export default function General({ company, setCompany, setSucess }: {
    company: Company,
    setCompany: React.Dispatch<React.SetStateAction<Company>>
    setSucess: React.Dispatch<React.SetStateAction<boolean>>
})
{
    const [price, setPrice] = useState<{ float: number, formatted: string, value: string }>(company.stock.price);

    useEffect(() => setCompany({ ...company, stock: { ...company.stock, price } }), [price]);
    useEffect(() => setSucess(company.name.length > 0 && company.stock.ticker.length > 0 && company.stock.price.float > 0), [company]);

    const onChange = (ticker: string) => setCompany({ ...company, stock: { ...company.stock, ticker } });

    return (
        <div className='flex flex-col gap-4'>
            <p className='text-base'>Registre as informações gerais da nova ação a ser cadastrada.</p>
            <InputField title='Empresa' field='name' value={company} setValue={setCompany} />
            <section className='flex gap-4'>
                <Input title='Ticker' value={company.stock.ticker} onChange={onChange} className='flex-1' />
                <InputCurrency title='Cotação' value={price} setValue={setPrice} className='flex-1' />
            </section>
        </div>
    );
}
