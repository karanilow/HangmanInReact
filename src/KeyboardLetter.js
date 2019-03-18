import React from 'react'
import PropTypes from 'prop-types'

import './KeyboardLetter.css'

const KeyboardLetter = ({ letter, state, onClick}) => (
    <div className={`letter ${state}`} onClick={() => onClick(letter)}>
        <span>
            {letter}
        </span>
    </div>
)

KeyboardLetter.propTypes = {
    letter : PropTypes.string.isRequired,
    state : PropTypes.oneOf([
        'hasBeenClicked',
        false,
    ]),
    onClick : PropTypes.func.isRequired,
}

export default KeyboardLetter