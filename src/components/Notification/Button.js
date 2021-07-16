import React from 'react';
import {css, cx} from 'emotion';
import colors from '../styles/colors';

//import your ICON component & make sure your path is right
import Icon from "./Icon";

export default function Button({
    children,
    disabled,
    icon,
    ...props
}) {

    //const mergedStyles = cx(//your css);
    return (
        <button {...props} disabled={disabled} className={mergedStyles}>

        // If icon prop is provided then render ICON component
        {icon && <Icon type={icon}/>}

        //Other children
        {children}

        </button>
    )
}