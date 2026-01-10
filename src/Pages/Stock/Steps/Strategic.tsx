import { useEffect, useState } from 'react';

import type { Company } from '../../../Persistence/Entities/Company';
import type { Assessment } from '../../../Persistence/Entities/Assessment';

const ASSESSMENTS: Assessment[] = [
    {
        category: 'Forças de Porter',
        questions: [
            { value: 'Rivalidade entre as concorrentes' },
            { value: 'Ameaça de produtos substitutos' },
            { value: 'Ameaça de novos concorrentes' },
            { value: 'Poder de barganha dos clientes' }
        ]
    }
];

export default function Strategic({ company, setCompany, setSuccess }: {
    company: Company,
    setCompany: React.Dispatch<React.SetStateAction<Company>>
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>
})
{
    useEffect(() =>  setSuccess(company.indices.iest.flat().every(value => value > 0)), [company.indices]);

    const [values, setValues] = useState<number[][]>(
        company.indices.iest.length
            ? company.indices.iest
            : Array.from(Array(ASSESSMENTS.length).keys())
                   .map((i): number[] => Array.from(Array(ASSESSMENTS[i].questions.length).keys()).map(_ => -1))
    );

    useEffect(() => setCompany({ ...company, indices: { ...company.indices, iest: values } }), [values]);

    const answerTemplate = (answer: string, value: number[], assessmentIndex: number, questionIndex: number, answerIndex: number) => {
        const colors = [ 'bg-red-500', 'bg-yellow-300', 'bg-green-500' ];

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
    };

    const questionTemplate = (question: { value: string, inverse?: boolean }, value: number[], assessmentIndex: number, questionIndex: number) => {
        let answers = [ 'Alta', 'Neutro', 'Baixa' ];

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
        const value = values[assessmentIndex];

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
            <p className='text-base'>Registre as informações acerca do posicionamento da empresa dentro do setor na qual ela atua.</p>
            {
                ASSESSMENTS.map(assessmentTemplate)
            }
        </div>
    );
}
