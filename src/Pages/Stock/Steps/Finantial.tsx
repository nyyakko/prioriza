import { useEffect, useState } from 'react';

import Checkbox from '../../../Components/Checkbox';
import type { Company } from '../../../Persistence/Entities/Company';
import type { Assessment } from '../../../Persistence/Entities/Assessment';

const ASSESSMENTS: Assessment[] = [
    {
        category: 'Eficiência',
        questions: [
            { value: 'A margem líquida histórica da empresa é boa? (mais que 5%)' }
        ]
    },
    {
        category: 'Rentabilidade',
        questions: [
            { value: 'O ROE histórico da empresa é bom (mais que 5%)?' },
            { value: 'A empresa tem bom histórico de pagamento de dividendos?' }
        ]
    },
    {
        category: 'Crescimento',
        questions: [
            { value: 'O CAGR Lucro (ou Receita) da empresa dos últimos é bom (mais que 5%)?' }
        ]
    },
    {
        category: 'Estabilidade',
        questions: [
            { value: 'A empresa tem mais de 30 anos?' },
            { value: 'A empresa é líder no mercado em que atua?' },
            { value: 'A empresa é privada?' }
        ]
    }
];

export default function Finantial({ company, setCompany, setSuccess }: {
    company: Company,
    setCompany: React.Dispatch<React.SetStateAction<Company>>
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>
})
{
    useEffect(() => setSuccess(true), []);

    const [values, setValues] = useState<number[][]>(
        company.indices.ifin.length
            ? company.indices.ifin
            : Array.from(Array(ASSESSMENTS.length).keys())
                   .map((i): number[] => Array.from(Array(ASSESSMENTS[i].questions.length).keys()).map(_ => 0))
    );

    useEffect(() => setCompany({ ...company, indices: { ...company.indices, ifin: values } }), [values]);

    const questionTemplate = (question: { value: string, inverse?: boolean }, value: number[], assessmentIndex: number, questionIndex: number) => {
        const onCheck = (state: boolean) => {
            values[assessmentIndex] = (value[questionIndex] = state ? 1 : 0, value);
            setValues([ ...values ]);
        };
        return <Checkbox value={value[questionIndex] === 1} title={question.value} onCheck={onCheck} key={questionIndex} />;
    };

    const assessmentTemplate = (assesment: Assessment, assessmentIndex: number) => {
        let value = values[assessmentIndex];

        return (
            <section className='flex flex-col gap-1' key={assessmentIndex}>
                <h1 className='font-bold'>{assesment.category}</h1>
                {
                    assesment.questions.map((question, questionIndex) => questionTemplate(question, value, assessmentIndex, questionIndex))
                }
            </section>
        )
    };

    return (
        <div className='flex flex-col gap-4'>
            <p className='text-base'>Registre as informações acerca do desempenho financeiro passado da empresa.</p>
            {
                ASSESSMENTS.map(assessmentTemplate)
            }
        </div>
    );
}
