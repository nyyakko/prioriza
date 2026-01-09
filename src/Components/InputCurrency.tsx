import CurrencyInput, { formatValue, type CurrencyInputOnChangeValues } from 'react-currency-input-field';

type InputCurrencyProps = {
    title?: string;
    value: { float: number, formatted: string, value: string };
    setValue: React.Dispatch<React.SetStateAction<{ float: number, formatted: string, value: string }>>;
    className?: string;
};

export default function InputCurrency(props: InputCurrencyProps)
{
    const onChange = (_value?: string, _name?: string, values?: CurrencyInputOnChangeValues) => {
        if (values) {
            const formatted = formatValue({ value: values.value.replace('.', '').replace(',', '.'), intlConfig: { locale: 'pt-BR', currency: 'BRL' } });
            props.setValue({ float: values.float!, formatted, value: values.value });
        }
    };

    return (
        <div className={props.className}>
            { props.title ? <span className='block pb-2'>{props.title}</span> : <></> }
            <div className='flex border border-gray-200 rounded'>
                <span className='bg-gray-200 dark:bg-secondary-dark px-4 rounded-l inline-flex justify-center items-center text-gray-800'>
                    R$
                </span>
                <CurrencyInput
                    placeholder='0,00'
                    className={`px-4 py-3 w-full rounded-r ${props.className}`}
                    onValueChange={onChange}
                    intlConfig={{ locale: 'pt-BR' }}
                    value={props.value.value}
                />
            </div>
        </div>
    );
}
