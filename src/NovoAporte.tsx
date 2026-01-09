import { useRef, useState } from 'react';
import { formatValue } from 'react-currency-input-field';

import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, Title, type ChartData } from 'chart.js';

import Button from './Components/Button';
import InputCurrency from './Components/InputCurrency';
import type { Empresa } from './Entities/Empresa';
import Column from './Components/Column';
import Table from './Components/Table';

import calcularDistribuicaoDoAporte, { type Aporte } from './Utils/calcularAporte';
import roundToXDigits from './Utils/round';

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
                : formatValue({ value: `${roundToXDigits(total as number, 2)}`, intlConfig: { locale: 'pt-BR', currency: 'BRL' } });

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

export default function NovoAporte()
{
    const empresas: Empresa[] = JSON.parse(localStorage.getItem('empresas')!) as Empresa[] || [];

    const [aporte, setAporte] = useState<{ float: number, formatted: string, value: string }>({ float: 0, formatted: '', value: '' });
    const [distribuicao, setDistribuicao] = useState<Aporte[]>([]);

    const chartRef = useRef(null);

    const [data, setData] = useState<ChartData<"doughnut", number[], unknown>>({ labels: [], datasets: [{ data: [] }] });

    const onCalcular = () => {
        if (!(aporte.float > 0)) {
            return;
        }

        let chart = chartRef.current as unknown as Chart;

        const distribuicao = calcularDistribuicaoDoAporte(aporte.float, empresas);
        setDistribuicao(distribuicao);

        setData({
            labels: [...distribuicao.map(aporte => aporte.nome)],
            datasets: [{
                label: 'Total (R$)',
                data: [...distribuicao.map(result => result.total)],
                backgroundColor: [ '#3129d6', '#5b54de', '#847ee7', '#ada9ef', '#d6d4f7', '#eaeafb' ],
                borderWidth: 2,
            }]
        });

        chart.update();
    };

    return (
        <div className='flex flex-col gap-4 pt-4'>
            <section className='flex flex-row gap-4'>
                <InputCurrency value={aporte} setValue={setAporte} className='w-full' />
                <Button title='Calcular' className='w-full rounded-md px-8 py-3' onClick={onCalcular} />
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
                        <Table data={distribuicao} onRowClick={() => {}} className='w-full max-h-70' >
                            <Column field='nome' header='Empresa' />
                            <Column field='ticker' header='Ticker' />
                            <Column field='totalFormatado' header='Total' />
                            <Column field='quantidade' header='Qtd.' />
                        </Table>
                    </section>
                </section>
            </section>
            <Button title='Salvar' className='w-full rounded-md px-8 py-3' />
        </div>
    );
}
