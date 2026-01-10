import { useEffect, useState } from 'react';

import Checkbox from '../../../Components/Checkbox';
import type { Company } from '../../../Persistence/Entities/Company';
import type { Assessment } from '../../../Persistence/Entities/Assessment';

const ASSESSMENTS: Assessment[] = [
    {
        category: 'Estrutura de Propriedade e Controle',
        questions: [
            { value: 'A empresa é de Novo Mercado?' },
            { value: 'O(s) controlador(es) possui(em) menos que 70% do total de ações ordinárias?' }
        ]
    },
    {
        category: 'Situação da Gestão',
        questions: [
            { value: 'A empresa tem boa gestão (corrupção = não)' },
        ]
    },
    {
        category: 'Relação com os Funcionários',
        questions: [
            { value: 'A empresa é bem avaliada pelos funcionários?' }
        ]
    }
];

export default function Governance({ company, setCompany, setSuccess }: {
    company: Company,
    setCompany: React.Dispatch<React.SetStateAction<Company>>
    setSuccess: React.Dispatch<React.SetStateAction<boolean>>
})
{
    useEffect(() => setSuccess(true), []);

    const [values, setValues] = useState<number[][]>(
        company.indices.igov.length
            ? company.indices.igov
            : Array.from(Array(ASSESSMENTS.length).keys())
                   .map((i): number[] => Array.from(Array(ASSESSMENTS[i].questions.length).keys()).map(_ => 0))
    );

    useEffect(() => setCompany({ ...company, indices: { ...company.indices, igov: values } }), [values]);

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
            <p className='text-base'>Registre as informações acerca da qualidade da governaça da empresa.</p>
            {
                ASSESSMENTS.map(assessmentTemplate)
            }
        </div>
    );
}
