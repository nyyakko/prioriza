import type { Empresa } from '../Entities/Empresa';

import roundToXDigits from './round';

function calcularIFIN(notasDosIndicadores: number[])
{
    let somaDasNotas = notasDosIndicadores.reduce((sum, current) => sum + current, 0);
    let correcao = notasDosIndicadores.length;
    return  somaDasNotas / correcao;
};

function calcularISET(notasDosIndicadores: number[])
{
    const NOTA_MAXIMA = 5;
    let somaDasNotas = notasDosIndicadores.reduce((sum, current) => sum + current, 0);
    let correcao = notasDosIndicadores.length * NOTA_MAXIMA;
    return  somaDasNotas / correcao;
}

function calcularIEST(notasDosIndicadores: number[])
{
    const NOTA_MAXIMA = 3;
    let somaDasNotas = notasDosIndicadores.reduce((sum, current) => sum + current, 0);
    let correcao = notasDosIndicadores.length * NOTA_MAXIMA;
    return  somaDasNotas / correcao;
}

function calcularIGOV(notasDosIndicadores: number[])
{
    let somaDasNotas = notasDosIndicadores.reduce((sum, current) => sum + current, 0);
    let correcao = notasDosIndicadores.length;
    return  somaDasNotas / correcao;
}

export default function calcularViablidade(empresa: Empresa, pesos: { iest: number, iset: number, ifin: number, igov: number })
{
    let indicadores = [
        Math.round(calcularIEST(empresa.indicadores?.iest.flat()!) * 100) * pesos.iest,
        Math.round(calcularISET(empresa.indicadores?.iset.flat()!) * 100) * pesos.iset,
        Math.round(calcularIFIN(empresa.indicadores?.ifin.flat()!) * 100) * pesos.ifin,
        Math.round(calcularIGOV(empresa.indicadores?.igov.flat()!) * 100) * pesos.igov,
    ];
    return roundToXDigits(indicadores.reduce((sum, current) => sum + current, 0), 1);
}
