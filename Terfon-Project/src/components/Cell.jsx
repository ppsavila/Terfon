import React from 'react';

export default function Cell({ char, state }) {
    return (
        <div className="cell" data-state={state}>
            {char}
        </div>
    );
}
