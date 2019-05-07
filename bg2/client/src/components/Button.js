import React from 'react'

const Button = (props) => {

    return(
        <div>
            <button className = {props.class} onClick = {props.action} >{props.buttonTitle}</button>
        </div>
    )
}

export default Button