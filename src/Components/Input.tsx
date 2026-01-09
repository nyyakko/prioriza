type InputProps<T> = {
    title?: string;
    value: T;
    placeholder?: string;
    onChange: (data: T) => void;
    className?: string;
};

export default function Input<T>(props: InputProps<T>)
{
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange?.(event.target.value as T);
    };

    return (
        <div className={props.className}>
            <span className='block pb-2'>{props.title}</span>
            <input
                placeholder={props.placeholder}
                className={`px-4 py-3 w-full rounded-r flex border border-gray-200 rounded  ${props.className}`}
                onChange={onChange}
                value={props.value as string}
            />
        </div>
    );
}
