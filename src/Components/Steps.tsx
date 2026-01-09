import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';

type Step = {
    label: string;
    icon?: IconDefinition;
    element: ReactNode;
};

type StepsProps = {
    items: Step[];
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    unlocked?: boolean;
};

export default function Steps(props: StepsProps)
{
    const stepTemplate = (item: Step, i: number) => {
        const onClick = () => {
            if (props.unlocked != undefined) {
                props.setActiveIndex(i);
            }
        };

        return (
            <div
                className={`
                    flex flex-col
                    items-center
                    gap-2
                    ${i !== props.activeIndex && props.unlocked != undefined ? 'hover:text-text cursor-pointer' : ''}
                    z-2
                `}
                onClick={onClick}
                key={i}
            >
                <span
                    className={`
                        transition-transform ease-in-out duration-150
                        inline-flex
                        justify-center items-center
                        w-12 h-12
                        border
                        rounded-full
                        ${
                            i === props.activeIndex
                                ? 'scale-110 bg-accent border-accent dark:bg-accent-dark dark:border-accent-dark text-white dark:text-text-dark'
                                : `bg-white dark:bg-black border-gray-100 ${props.unlocked == undefined ? 'text-gray-400' : ''}`
                        }
                    `}
                >
                    { item.icon ? <FontAwesomeIcon icon={item.icon} /> : i+1 }
                </span>
                {item.label}
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-4'>
            <section className='relative flex justify-between'>
                { props.items.map(stepTemplate) }
                <span className='absolute top-6 w-full h border-t-2 border-gray-100 z-1' />
            </section>
            {
                props.items[props.activeIndex].element
            }
        </div>
    );
}
