type CheckboxProps = {
    title: string;
    value: boolean;
    onCheck?: (value: boolean) => void;
};

export default function Checkbox(props: CheckboxProps)
{
    const onCheck = (event: React.ChangeEvent<HTMLInputElement>) => props.onCheck?.(event.target.checked);

    return <div className='flex gap-4 items-center'>
        <input className='w-5 h-5 accent-accent dark:accent-accent-dark cursor-pointer' type='checkbox' onChange={onCheck} checked={props.value} />
        <label>{props.title}</label>
    </div>;
}
