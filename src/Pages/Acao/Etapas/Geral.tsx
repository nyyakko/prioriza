import { useEffect, useState } from 'react';

import type { Empresa } from '../../../Entities/Empresa';
import InputField from '../../../Components/InputField';
import Input from '../../../Components/Input';
import InputCurrency from '../../../Components/InputCurrency';

export default function Geral({ empresa, setEmpresa, setSucesso }: {
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
