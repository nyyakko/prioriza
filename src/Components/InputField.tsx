type InputFieldProps<T> = {
    title?: string;
    field: keyof T;
    value: T;
    placeholder?: string;
    setValue: React.Dispatch<React.SetStateAction<T>>;
    className?: string;
};

export default function InputField<T>(props: InputFieldProps<T>)
{
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.setValue?.({ ...props.value, [props.field]: event.target.value });
    };

    return (
        <div className={props.className}>
            <span className='block pb-2'>{props.title}</span>
            <input
                placeholder={props.placeholder}
                className={`px-4 py-3 w-full rounded-r flex border border-gray-200 rounded  ${props.className}`}
                onChange={onChange}
                value={props.value[props.field] as string}
            />
        </div>
    );
}
