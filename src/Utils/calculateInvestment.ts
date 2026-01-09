import { formatValue } from 'react-currency-input-field';

import round from './round';

import type { Company } from '../Entities/Company';

export default function calculateInvestment(investment: number, companies: Company[])
{
    let stocks = companies.map(company => {
        return {
            company: company.name,
            ticker: company.stock.ticker,
            price: company.stock.price.float,
            bias: company.bias
        };
    });

    stocks = stocks.filter(stock => investment > 500 || stock.bias > 60);

    let biases = stocks.map(stock => stock.bias);
    let sum = biases.reduce((sum, current) => sum + current, 0);
    let normalizedBiases = biases.map(preferencia => preferencia / sum, 2);

    let investments = normalizedBiases.map((preferencia, i) => {
        const count = Math.trunc(round(investment * preferencia, 2) / stocks[i].price);
        const total = round(count * stocks[i].price, 2);
        return {
            company: stocks[i].company,
            ticker: stocks[i].ticker,
            total: total,
            formattedTotal: formatValue({ value: `${total}`, intlConfig: { locale: 'pt-BR', currency: 'BRL' } }),
            count: count
        };
    });

    return investments.filter(investment => investment.count > 0);
}
