import { useEffect, useState } from 'react';

import type { Categoria } from '../../../Entities/Categoria';
import type { Pergunta } from '../../../Entities/Pergunta';
import type { Empresa } from '../../../Entities/Empresa';

export default function Estrategico({ empresa, setEmpresa, setSucesso }: {
    empresa: Empresa,
    setEmpresa: React.Dispatch<React.SetStateAction<Empresa>>
    setSucesso: React.Dispatch<React.SetStateAction<boolean>>
})
{
    useEffect(() =>  setSucesso(empresa.indicadores.iest.flat().every(value => value > 0)), [empresa.indicadores]);

    const categorias: Categoria[] = [
        {
            categoria: 'Forças de Porter',
            perguntas: [
                { conteudo: 'Rivalidade entre as concorrentes' },
                { conteudo: 'Ameaça de produtos substitutos' },
                { conteudo: 'Ameaça de novos concorrentes' },
                { conteudo: 'Poder de barganha dos clientes' }
            ]
        }
    ];

    const [values, setValues] = useState<number[][]>(
        empresa.indicadores.iest.length
            ? empresa.indicadores.iest
            : Array.from(Array(categorias.length).keys())
                   .map((i): number[] => Array.from(Array(categorias[i].perguntas.length).keys()).map(_ => -1))
    );

    useEffect(() => setEmpresa({ ...empresa, indicadores: { ...empresa.indicadores, iest: values } }), [values]);

    const perguntasTemplate = (pergunta: Pergunta, value: number[], i: number, j: number) => {
        let respostas = [ 'Alta', 'Neutro', 'Baixa' ];
        const cores = [ 'bg-red-500', 'bg-yellow-300', 'bg-green-500' ];

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
                                    ${value[j] - 1 === i || value[j] === -1 ? 'opacity-100' : 'opacity-25'}
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
        const value = values[i];
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
            <p className='text-base'>Registre as informações acerca do posicionamento da empresa dentro do setor na qual ela atua.</p>
            {
                categorias.map(categoriasTemplate)
            }
        </div>
    );
}
