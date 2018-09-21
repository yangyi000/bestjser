import React from 'react';
import PropTypes from 'prop-types'

const Login=({text,id,onClick,dbClick,complete,show})=>  (
            <div className={text} style={{color:complete?'red':'green'}}>
                {text}{show}
                <p id={id} onClick={onClick}>change</p>
                <p onClick={dbClick}>change</p>
            </div>
        );

Login.propTypes={
    text: PropTypes.string,
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
}
export default Login;
