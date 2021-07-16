import React from "react";
import { css } from 'emotion';

import Accept from "./icons8-tick-box-48.png";
import Cancel from "./icons8-cross-mark-button-48.png";

export const iconTypes = {
    Accept: 'ARROW_RIGHT',
    Cancel: 'ARROW_LEFT',
}

const iconSrc = {
    ACCEPT: Accept,
    CANCEL: Cancel,
}


const circleStyles = css({
    width: 24,
    height: 24,
    borderRadius: "50%",
    backgroundColor: "#f7f7f9",
    display: "flex",
    justifyContent: "center"
});


export default function Icon({ type }) {
    return (
         <div className={circleStyles}>
            <img src={iconSrc[type]} />
        </div>
    )
};