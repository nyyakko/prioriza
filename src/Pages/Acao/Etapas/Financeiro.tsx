import { useEffect, useState } from 'react';

import Checkbox from '../../../Components/Checkbox';
import type { Categoria } from '../../../Entities/Categoria';
import type { Pergunta } from '../../../Entities/Pergunta';
import type { Empresa } from '../../../Entities/Empresa';

export default function Financeiro({ empresa, setEmpresa, setSucesso }: {
    empresa: Empresa,
    setEmpresa: React.Dispatch<React.SetStateAction<Empresa>>
    setSucesso: React.Dispatch<React.SetStateAction<boolean>>
})
{
    useEffect(() => setSucesso(true), []);

    const categorias: Categoria[] = [
        {
            categoria: 'Eficiência',
            perguntas: [
                { conteudo: 'A margem líquida histórica da empresa é boa? (mais que 5%)' }
            ]
        },
        {
            categoria: 'Rentabilidade',
            perguntas: [
                { conteudo: 'O ROE histórico da empresa é bom (mais que 5%)?' },
                { conteudo: 'A empresa tem bom histórico de pagamento de dividendos?' }
            ]
        },
        {
            categoria: 'Crescimento',
            perguntas: [
                { conteudo: 'O CAGR Lucro (ou Receita) da empresa dos últimos é bom (mais que 5%)?' }
            ]
        },
        {
            categoria: 'Estabilidade',
            perguntas: [
                { conteudo: 'A empresa tem mais de 30 anos?' },
                { conteudo: 'A empresa é líder no mercado em que atua?' },
                { conteudo: 'A empresa é privada?' }
            ]
        }
    ];

    const [values, setValues] = useState<number[][]>(
        empresa.indicadores.ifin.length
            ? empresa.indicadores.ifin
            : Array.from(Array(categorias.length).keys())
                   .map((i): number[] => Array.from(Array(categorias[i].perguntas.length).keys()).map(_ => 0))
    );

    useEffect(() => setEmpresa({ ...empresa, indicadores: { ...empresa.indicadores, ifin: values } }), [values]);

    const perguntasTemplate = (pergunta: Pergunta, value: number[], i: number, j: number) => {
        const onCheck = (state: boolean) => {
            values[i] = (value[j] = state ? 1 : 0, value);
            setValues([ ...values ]);
        };
        return <Checkbox value={value[j] === 1} title={pergunta.conteudo} onCheck={onCheck} key={j} />;
    }

    const categoriasTemplate = (pergunta: { categoria: string, perguntas: Pergunta[] }, i: number) => {
        const value = values[i];
        return (
            <section className='flex flex-col gap-1' key={i}>
                <h1 className='font-bold'>{pergunta.categoria}</h1>
                {
                    pergunta.perguntas.map((pergunta, j) => perguntasTemplate(pergunta, value, i, j))
                }
            </section>
        );
    }

    return (
        <div className='flex flex-col gap-4'>
            <p className='text-base'>Registre as informações acerca do desempenho financeiro passado da empresa.</p>
            {
                categorias.map(categoriasTemplate)
            }
        </div>
    );
}
