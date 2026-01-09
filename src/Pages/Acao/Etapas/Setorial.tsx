import { useEffect, useState } from 'react';

import type { Categoria } from '../../../Entities/Categoria';
import type { Pergunta } from '../../../Entities/Pergunta';
import type { Empresa } from '../../../Entities/Empresa';

export default function Setorial({ empresa, setEmpresa, setSucesso }: {
    empresa: Empresa,
    setEmpresa: React.Dispatch<React.SetStateAction<Empresa>>
    setSucesso: React.Dispatch<React.SetStateAction<boolean>>
})
{
    useEffect(() => setSucesso(empresa.indicadores.iset.flat().every(value => value > 0)), [empresa.indicadores]);

    const categorias: Categoria[] = [
        {
            categoria: 'Estrutura e Natureza do Setor',
            perguntas: [
                { conteudo: 'O número de empresas no setor é grande?', inverso: true},
                { conteudo: 'O setor está ganhando mercado externo?', inverso: false },
                { conteudo: 'O setor é muito regulado?', inverso: true }
            ]
        },
        {
            categoria: 'Perspectivas de Demanda',
            perguntas: [
                { conteudo: 'O setor é de crescimento sustentável?', inverso: false },
                { conteudo: 'Há demanda do setor em novos mercados?', inverso: false },
            ]
        },
        {
            categoria: 'Custos e Lucratividade do Setor',
            perguntas: [
                { conteudo: 'A lucratividade do setor pode ser prejudicada por intervenções políticas?', inverso: true }
            ]
        }
    ];

    const [values, setValues] = useState<number[][]>(
        empresa.indicadores.iset.length
            ? empresa.indicadores.iset
            : Array.from(Array(categorias.length).keys())
                   .map((i): number[] => Array.from(Array(categorias[i].perguntas.length).keys()).map(_ => -1))
    );

    useEffect(() => setEmpresa({ ...empresa, indicadores: { ...empresa.indicadores, iset: values } }), [values]);

    const perguntasTemplate = (pergunta: Pergunta, value: number[], i: number, j: number) => {
        let respostas = [ 'Não', 'Improvável', 'Neutro', 'Provável', 'Sim' ];
        const cores = [ 'bg-red-500', 'bg-yellow-500', 'bg-yellow-300', 'bg-lime-400', 'bg-green-500' ];

        if (pergunta.inverso) {
            respostas = respostas.reverse();
        }

        const onClick = (index: number) => {
            values[i] = (value[j] = index, value);
            setValues([ ...values ]);
        };

        return (
            <div className='flex flex-col gap-2' key={j}>
                <span>{pergunta.conteudo}</span>
                <div className='flex gap-2'>
                {
                    respostas.map((alternativa, i) => {
                        return (
                            <button
                                className={`
                                    cursor-pointer
                                    hover:scale-110 transition duration-75
                                    inline-flex items-center
                                    rounded-md text-wrap
                                    p-2 h-8
                                    ${cores[i]}
                                    ${(value[j]-1 === i || value[j] === -1) ? 'opacity-100' : 'opacity-25'}
                                `}
                                onClick={() => onClick(i+1)}
                                key={i}
                            >
                                {alternativa}
                            </button>
                        )
                    })
                }
                </div>
            </div>
        );
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
            <p className='text-base'>Registre as informações acerca da atratividade do setor na qual a empresa está inserida.</p>
            {
                categorias.map(categoriasTemplate)
            }
        </div>
    );
}
