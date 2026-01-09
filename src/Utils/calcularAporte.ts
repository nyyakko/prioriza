import { formatValue } from 'react-currency-input-field';
import type { Empresa } from '../Entities/Empresa';

import roundToXDigits from './round';

export type Aporte = {
    nome: string;
    ticker: string;
    total: number;
    totalFormatado: string;
    quantidade: number;
};

export default function calcularDistribuicaoDoAporte(aporte: number, empresas: Empresa[]): Aporte[]
{
    let acoes = empresas.map(empresa => {
        return {
            nome: empresa.nome,
            ticker: empresa.acao.ticker,
            cotacao: empresa.acao.cotacao.float,
            preferencia: `${empresa.preferencia}%`
        };
    });

    acoes = acoes.filter(acao => aporte > 500 || parseFloat(acao.preferencia) > 60);

    let preferencias = acoes.map(acao => parseFloat(acao.preferencia));
    let soma = preferencias.reduce((sum, current) => sum + current, 0);
    let preferenciasNormalizadas = preferencias.map(preferencia => preferencia / soma, 2);

    let aportes = preferenciasNormalizadas.map((preferencia, i) => {
        const numeroDeAcoes = Math.trunc(roundToXDigits(aporte * preferencia, 2) / acoes[i].cotacao);
        const total = roundToXDigits(numeroDeAcoes * acoes[i].cotacao, 2);
        return {
            nome: acoes[i].nome,
            ticker: acoes[i].ticker,
            totalFormatado: formatValue({ value: `${total}`, intlConfig: { locale: 'pt-BR', currency: 'BRL' } }),
            total: total,
            quantidade: numeroDeAcoes
        };
    });

    return aportes.filter(preferencia => preferencia.quantidade > 0);
}
