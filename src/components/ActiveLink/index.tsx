import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router';
import { ReactElement, cloneElement } from 'react';

interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
    const { asPath } = useRouter()

    const className = asPath === rest.href 
        ? activeClassName
        : '';

    return (
        <Link {...rest}>
            
            {cloneElement(children, { //The cloneElement method allows us to return an HTML element and add properties to it
                className,
            })}
        </Link>
    )
}