type ColumnProps = {
    field: string;
    header: string;
};

export default function Column(props: ColumnProps)
{
    return (
        <th className='sticky top-0 p-3 bg-gray-200 text-text/80 font-bold text-sm text-start'>{props.header}</th>
    );
}
