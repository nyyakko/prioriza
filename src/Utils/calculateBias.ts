import type { Company } from '../Persistence/Entities/Company';
import type { Weights } from '../Persistence/Entities/Weights';

import round from './round';

export default function calculateBias(company: Company, weights: Weights)
{
    const calculateIndex = (grades: number[], maxGrade: number) => {
        let sum = grades.reduce((sum, current) => sum + current, 0);
        let correction = grades.length * maxGrade;
        return Math.round((sum / correction) * 100);
    };

    let indices = [
        calculateIndex(company.indices?.iest.flat()!, 3) * weights.iest,
        calculateIndex(company.indices?.iset.flat()!, 5) * weights.iset,
        calculateIndex(company.indices?.ifin.flat()!, 1) * weights.ifin,
        calculateIndex(company.indices?.igov.flat()!, 1) * weights.igov,
    ];

    return round(indices.reduce((sum, current) => sum + current, 0), 1);
}
