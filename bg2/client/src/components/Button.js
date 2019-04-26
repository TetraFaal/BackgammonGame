import React from 'react'

const Button = (props) => {

    return(
        <div>
            <button onClick = {props.action} >{props.buttonTitle}</button>
        </div>
    )
}

export default Button