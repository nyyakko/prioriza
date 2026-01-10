import { useEffect, useState } from 'react';

import type { Company } from '../../../Persistence/Entities/Company';
import type { Assessment } from '../../../Persistence/Entities/Assessment';

const ASSESSMENTS: Assessment[] = [
    {
        category: 'Estrutura e Natureza do Setor',
        questions: [
            { value: 'O número de empresas no setor é grande?', inverse: true },
            { value: 'O setor está ganhando mercado externo?', inverse: false },
            { value: 'O setor é muito regulado?', inverse: true }
        ]
    },
    {
        category: 'Perspectivas de Demanda',
        questions: [
            { value: 'O setor é de crescimento sustentável?', inverse: false },
            { value: 'Há demanda do setor em novos mercados?', inverse: false },
        ]
    },
    {
        category: 'Custos e Lucratividade do Setor',
        questions: [
            { value: 'A lucratividade do setor pode ser prejudicada por intervenções políticas?', inverse: true }
        ]
    }
];

export default function Sectoral({ company, setCompany, setSuccess }: {
    company: Company,
    setCompany: React.Dispatch<React.SetStateAction<Company>>
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>
})
{
    useEffect(() => setSuccess(company.indices.iset.flat().every(value => value > 0)), [company.indices]);

    const [values, setValues] = useState<number[][]>(
        company.indices.iset.length
            ? company.indices.iset
            : Array.from(Array(ASSESSMENTS.length).keys())
                   .map((i): number[] => Array.from(Array(ASSESSMENTS[i].questions.length).keys()).map(_ => -1))
    );

    useEffect(() => setCompany({ ...company, indices: { ...company.indices, iset: values } }), [values]);

    const answerTemplate = (answer: string, value: number[], assessmentIndex: number, questionIndex: number, answerIndex: number) => {
        const colors = [ 'bg-red-500', 'bg-yellow-500', 'bg-yellow-300', 'bg-lime-400', 'bg-green-500' ];

        const onClick = (index: number) => {
            values[assessmentIndex] = (value[questionIndex] = index, value);
            setValues([ ...values ]);
        };

        return (
            <button
                className={`
                    cursor-pointer
                    hover:scale-110 transition duration-75
                    inline-flex items-center
                    rounded-md text-wrap
                    p-2 h-8
                    ${colors[answerIndex]}
                    ${(value[questionIndex]-1 === answerIndex || value[questionIndex] === -1) ? 'opacity-100' : 'opacity-25'}
                `}
                onClick={() => onClick(answerIndex+1)}
                key={answerIndex}
            >
                {answer}
            </button>
        )
    }

    const questionTemplate = (question: { value: string, inverse?: boolean }, value: number[], assessmentIndex: number, questionIndex: number) => {
        let answers = [ 'Não', 'Improvável', 'Neutro', 'Provável', 'Sim' ];

        if (question.inverse) {
            answers = answers.reverse();
        }

        return (
            <div className='flex flex-col gap-2' key={questionIndex}>
                <span>{question.value}</span>
                <div className='flex gap-2'>
                {
                    answers.map((answer, answerIndex) => answerTemplate(answer, value, assessmentIndex, questionIndex, answerIndex))
                }
                </div>
            </div>
        );
    };

    const assessmentTemplate = (assessment: Assessment, assessmentIndex: number) => {
        let value = values[assessmentIndex];

        return (
            <section className='flex flex-col gap-1' key={assessmentIndex}>
                <h1 className='font-bold'>{assessment.category}</h1>
                {
                    assessment.questions.map((question, questionIndex) => questionTemplate(question, value, assessmentIndex, questionIndex))
                }
            </section>
        )
    };

    return (
        <div className='flex flex-col gap-4'>
            <p className='text-base'>Registre as informações acerca da atratividade do setor na qual a empresa está inserida.</p>
            {
                ASSESSMENTS.map(assessmentTemplate)
            }
        </div>
    );
}
