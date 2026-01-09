import React, { type  ReactNode } from 'react';
import { resolveProperty } from '../Utils/resolveProperty';

type TableProps<T> = {
    data: T[];
    children: ReactNode;
    onRowClick?: (data: T, index: number) => void;
    className?: string;
};

export function Table<T>(props: TableProps<T>)
{
    const columns =
        React.Children.toArray(props.children)
            .map(child => {
                if (React.isValidElement(child)) {
                    return child.props as { field: string, header: string };
                }
                return null;
            });

    return (
        <section className={`overflow-scroll ${props.className}`}>
            <table className='w-full'>
                <thead>
                    <tr>{ props.children }</tr>
                </thead>
                <tbody>
                {
                    props.data.map((data, i) => {
                        return (
                            <tr
                                className={`${i % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'} hover:bg-gray-200 border-gray-200 border`}
                                key={i}
                                onClick={() => props.onRowClick?.(data, i)}
                            >
                                {
                                    columns.map((column, j) => {
                                        const value = resolveProperty(data, column?.field!);
                                        return <td className='p-3 text-text/80 dark:text-text-dark text-md' key={j}>{value as string}</td>
                                    })
                                }
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </section>
    );
}

type ColumnProps = {
    field: string;
    header: string;
};

export function Column(props: ColumnProps)
{
    return (
        <th className='sticky top-0 p-3 bg-gray-200 text-text/80 font-bold text-sm text-start'>{props.header}</th>
    );
}
