import { useRef, useState } from 'react';
import { formatValue } from 'react-currency-input-field';

import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, Title, type ChartData } from 'chart.js';

import Button from '../../../Components/Button';
import Column from '../../../Components/Column';
import InputCurrency from '../../../Components/InputCurrency';
import Table from '../../../Components/Table';
import type { Company } from '../../../Entities/Company';

import round from '../../../Utils/round';
import calculateInvestment from '../../../Utils/calculateInvestment';

Chart.register(ArcElement, Title, Tooltip, Legend);

const CHART_CENTER_TEXT_PLUGIN = Object.freeze({
    id: 'centerText',
    beforeDraw: (chart: Chart) => {
        const { ctx, chartArea, data } = chart;
        ctx.save();

        const centerX = chartArea.width / 2;
        const centerY = chartArea.height / 2;

        const total = data.datasets[0].data.reduce((sum, current) => (sum as number) + (current as number), 0);

        ctx.font = total === 0 ? '15px Arial' : '20px Arial';
        ctx.fillStyle = total === 0 ? '' : '#443DFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const text =
            data.datasets[0].data.length === 0 && total === 0
                ? 'Informe o valor do aporte.'
                : formatValue({ value: `${round(total as number, 2)}`, intlConfig: { locale: 'pt-BR', currency: 'BRL' } });

        ctx.fillText(text, centerX, centerY);

        ctx.restore();
    }
});

Chart.register(CHART_CENTER_TEXT_PLUGIN);

const CHART_OPTIONS = Object.freeze({
    plugins: {
        legend: {
            display: true,
            position: 'bottom' as const,
            align: 'center' as const,
            textDirection: 'ltr',
            labels: {
                usePointStyle: true,
                padding: 25
            }
        },
    }
});

type Investment = {
    company: string,
    ticker: string,
    total: number,
    formattedTotal: string,
    count: number
};

export default function NewInvestment()
{
    const companies = JSON.parse(localStorage.getItem('companies')!) as Company[] || [];

    const [price, setPrice] = useState<{ float: number, formatted: string, value: string }>({ float: 0, formatted: '', value: '' });
    const [investments, setInvestments] = useState<Investment[]>([]);

    const chartRef = useRef(null);

    const [data, setData] = useState<ChartData<'doughnut', number[], unknown>>({ labels: [], datasets: [{ data: [] }] });

    const onCalculate = () => {
        if (!(price.float > 0)) {
            return;
        }

        let chart = chartRef.current as unknown as Chart;

        const investments = calculateInvestment(price.float, companies);
        setInvestments(investments);

        setData({
            labels: [...investments.map(investment => investment.company)],
            datasets: [{
                label: 'Total (R$)',
                data: [...investments.map(investment => investment.total)],
                backgroundColor: [ '#3129d6', '#5b54de', '#847ee7', '#ada9ef', '#d6d4f7', '#eaeafb' ],
                borderWidth: 2,
            }]
        });

        chart.update();
    };

    return (
        <div className='flex flex-col gap-4 pt-4'>
            <section className='flex flex-row gap-4'>
                <InputCurrency value={price} setValue={setPrice} className='w-full' />
                <Button title='Calcular' className='w-full rounded-md px-8 py-3' onClick={onCalculate} />
            </section>
            <section className='flex flex-col gap-4 rounded-md'>
                <section className='bg-background dark:bg-background-dark rounded-lg px-6 py-4 flex flex-col border border-gray-200'>
                    <h1 className='text-accent dark:text-accent-dark font-bold text-xl pb-4'>Recomendação de Aporte</h1>
                    <section className='flex justify-center items-center'>
                        <div className='w-100 h-full'>
                            <Doughnut options={CHART_OPTIONS} data={data} ref={chartRef} />
                        </div>
                    </section>
                </section>
                <section className='bg-background dark:bg-background-dark rounded-lg px-6 py-4 flex flex-1 flex-col border border-gray-200'>
                    <h1 className='text-accent dark:text-accent-dark font-bold text-xl pb-4'>Ações Recomendadas</h1>
                    <section className='flex flex-row flex-1 justify-between gap-4'>
                        <Table data={investments} onRowClick={() => {}} className='w-full max-h-70' >
                            <Column field='company' header='Empresa' />
                            <Column field='ticker' header='Ticker' />
                            <Column field='formattedTotal' header='Total' />
                            <Column field='count' header='Quantidade' />
                        </Table>
                    </section>
                </section>
            </section>
        </div>
    );
}
