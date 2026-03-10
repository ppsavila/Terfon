import React, { useState, useRef, useEffect } from 'react';
import { CONSONANTS, VOWELS, VARIATIONS } from '../data/phonemes.js';
import { Delete } from 'lucide-react';

export default function Keyboard({ onKeyPress, keyboardState }) {
    const [isVowelsPage, setIsVowelsPage] = useState(false);
    const [activePopup, setActivePopup] = useState(null);

    const pressTimer = useRef(null);
    const isLongPress = useRef(false);

    // Close popup globally
    useEffect(() => {
        const handleGlobalPointerUp = () => {
            // Small delay so if they tap a button it registers first
            setTimeout(() => {
                setActivePopup(null);
            }, 50);
        };
        if (activePopup) {
            window.addEventListener('pointerup', handleGlobalPointerUp);
        }
        return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
    }, [activePopup]);

    const handlePressStart = (e, key) => {
        // Only capture if not an action key
        if (key === 'PAGE' || key === 'ENTER' || key === 'BACKSPACE') return;

        isLongPress.current = false;

        if (VARIATIONS[key]) {
            pressTimer.current = setTimeout(() => {
                isLongPress.current = true;
                setActivePopup(key);
            }, 350); // 350ms delay for long press
        }
    };

    const handlePressEnd = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    const handleClick = (e, key) => {
        if (key === 'PAGE' || key === 'ENTER' || key === 'BACKSPACE') {
            if (key === 'PAGE') setIsVowelsPage(!isVowelsPage);
            else onKeyPress(key);
            return;
        }

        if (activePopup) {
            return;
        }

        if (!isLongPress.current) {
            onKeyPress(key);
        }

        isLongPress.current = false;
    };

    const handlePointerLeave = () => {
        if (pressTimer.current) clearTimeout(pressTimer.current);
    };

    const handleVariationSelect = (e, variationKey) => {
        e.stopPropagation();
        onKeyPress(variationKey);
        setActivePopup(null);
    };

    const rows = isVowelsPage ? VOWELS : CONSONANTS;

    return (
        <div className="keyboard">
            {rows.map((row, i) => (
                <div key={`row-${i}`} className="keyboard-row">
                    {row.map(key => {
                        const state = keyboardState[key] || 'base';
                        const showPopup = activePopup === key;
                        const isAction = key === 'PAGE' || key === 'ENTER' || key === 'BACKSPACE';

                        return (
                            <div key={key} className={`key-container ${isAction ? 'key-container-large' : ''}`}>
                                {showPopup && VARIATIONS[key] && (
                                    <div className="variations-popup">
                                        {VARIATIONS[key].map(v => (
                                            <button
                                                key={v}
                                                className="variation-btn"
                                                onPointerUp={(e) => handleVariationSelect(e, v)}
                                                onClick={(e) => handleVariationSelect(e, v)}
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <button
                                    className={`key ${isAction ? 'key-large' : ''} ${showPopup ? 'key-active' : ''}`}
                                    data-state={state}
                                    onPointerDown={(e) => handlePressStart(e, key)}
                                    onPointerUp={handlePressEnd}
                                    onPointerLeave={handlePointerLeave}
                                    onPointerCancel={handlePressEnd}
                                    onClick={(e) => handleClick(e, key)}
                                    onTouchStart={(e) => handlePressStart(e, key)}
                                    onTouchEnd={handlePressEnd}
                                    onContextMenu={(e) => e.preventDefault()} // prevent right-click menu on long press on mobile
                                >
                                    {key === 'BACKSPACE' ? <Delete size={20} /> :
                                        key === 'PAGE' ? (isVowelsPage ? '2/2' : '1/2') :
                                            key === 'ENTER' ? 'ENTRA' : key}
                                </button>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
    );
}
