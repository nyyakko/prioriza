import { useEffect, useState } from 'react';

import Checkbox from '../../../Components/Checkbox';
import type { Categoria } from '../../../Entities/Categoria';
import type { Empresa } from '../../../Entities/Empresa';
import type { Pergunta } from '../../../Entities/Pergunta';

export default function IndicadorGovernanca({ empresa, setEmpresa, setSucesso }: {
    empresa: Empresa,
    setEmpresa: React.Dispatch<React.SetStateAction<Empresa>>
    setSucesso: React.Dispatch<React.SetStateAction<boolean>>
})
{
    useEffect(() => setSucesso(true), []);

    const categorias: Categoria[] = [
        {
            categoria: 'Estrutura de Propriedade e Controle',
            perguntas: [
                { conteudo: 'A empresa é de Novo Mercado?' },
                { conteudo: 'O(s) controlador(es) possui(em) menos que 70% do total de ações ordinárias?' }
            ]
        },
        {
            categoria: 'Situação da Gestão',
            perguntas: [
                { conteudo: 'A empresa tem boa gestão (corrupção = não)' },
            ]
        },
        {
            categoria: 'Relação com os Funcionários',
            perguntas: [
                { conteudo: 'A empresa é bem avaliada pelos funcionários?' }
            ]
        }
    ];

    const [values, setValues] = useState<number[][]>(
        empresa.indicadores.igov.length
            ? empresa.indicadores.igov
            : Array.from(Array(categorias.length).keys())
                   .map((i): number[] => Array.from(Array(categorias[i].perguntas.length).keys()).map(_ => 0))
    );

    useEffect(() => setEmpresa({ ...empresa, indicadores: { ...empresa.indicadores, igov: values } }), [values]);

    const perguntasTemplate = (pergunta: Pergunta, value: number[], i: number, j: number) => {
        const onCheck = (state: boolean) => {
            values[i] = (value[j] = state ? 1 : 0, value);
            setValues([ ...values ]);
        };
        return <Checkbox value={value[j] === 1} title={pergunta.conteudo} onCheck={onCheck} key={j} />;
    };

    const categoriasTemplate = (pergunta: { categoria: string, perguntas: Pergunta[] }, i: number) => {
        let value = values[i];
        return (
            <section className='flex flex-col gap-1' key={i}>
                <h1 className='font-bold'>{pergunta.categoria}</h1>
                {
                    pergunta.perguntas.map((pergunta, j) => perguntasTemplate(pergunta, value, i, j))
                }
            </section>
        )
    };

    return (
        <div className='flex flex-col gap-4'>
            <p className='text-base'>Registre as informações acerca da qualidade da governaça da empresa.</p>
            {
                categorias.map(categoriasTemplate)
            }
        </div>
    );
}
