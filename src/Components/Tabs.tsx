import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import React, { useState } from 'react';

type TabsProps = {
    children: ReactNode;
    className?: string;
};

export function Tabs(props: TabsProps)
{
    const [activeIndex, setActiveIndex] = useState(0);

    const tabs =
        React.Children.toArray(props.children)
            .map(child => {
                if (React.isValidElement(child)) {
                    return child.props as { header: string, icon?: IconDefinition, children: ReactNode };
                }
                return null;
            });

    return (
        <div className={`w-full flex flex-col bg-background ${props.className}`}>
            <section className='w-full flex flex-1'>
                <section className='flex flex-row'>
                {
                    tabs.map((tab, i) => {
                        return (
                            <div
                                className={`
                                    px-8
                                    py-4
                                    inline-flex
                                    ${
                                        activeIndex === i
                                            ? 'text-accent border-b-accent'
                                            : 'border-b-gray-200 hover:border-b-gray-400'
                                    }
                                    font-bold
                                    border-b-2
                                    uppercase
                                    transition
                                    cursor-pointer
                                    select-none
                                `}
                                onClick={() => setActiveIndex(i)}
                                key={i}
                            >
                                {tab?.icon ? <FontAwesomeIcon icon={tab.icon} /> : <></>}
                                {tab?.header}
                            </div>
                        );
                    })
                }
                </section>
                <section className='flex flex-1 border-b-2 border-b-gray-200' />
            </section>
            <section>
            {
                tabs?.[activeIndex]?.children
            }
            </section>
        </div>
    );
}

type TabProps = {
    header: string;
    icon?: IconDefinition;
    children?: ReactNode;
};

export function Tab(_props: TabProps)
{
    return <></>;
}
