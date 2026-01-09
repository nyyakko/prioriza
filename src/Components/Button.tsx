import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type ButtonProps = {
    title?: string;
    className?: string;
    icon?: IconDefinition;
    onClick?: () => void;
    disabled?: boolean;
};

export default function Button(props: ButtonProps)
{
    return (
        <button
            className={`
                flex
                justify-center items-center
                gap-2
                bg-accent
                dark:bg-accent-dark
                disabled:bg-gray-300
                active:brightness-50
                hover:brightness-75
                disabled:hover:brightness-100
                hover:cursor-pointer
                disabled:hover:cursor-default
                text-md
                text-white
                dark:text-text
                ${props.className}
            `}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.icon ? <FontAwesomeIcon icon={props.icon} /> : <></>}
            {props.title}
        </button>
    );
}
