import React from 'react';
import Cell from './Cell.jsx';

// Utility for Wordle-style evaluation considering duplicates
function getStates(guess, dailyWord) {
    const states = Array(guess.length).fill('absent');
    const wordCounts = {};
    dailyWord.forEach(c => {
        wordCounts[c] = (wordCounts[c] || 0) + 1;
    });

    // First pass: exact matches
    guess.forEach((c, i) => {
        if (c === dailyWord[i]) {
            states[i] = 'correct';
            wordCounts[c]--;
        }
    });

    // Second pass: present matches
    guess.forEach((c, i) => {
        if (states[i] !== 'correct' && wordCounts[c] > 0) {
            states[i] = 'present';
            wordCounts[c]--;
        }
    });

    return states;
}

export default function Board({ guesses, currentGuess, dailyWord, maxAttempts, wordLength, status }) {
    const empties = maxAttempts - guesses.length - (status === 'PLAYING' ? 1 : 0);

    return (
        <div className="board">
            {guesses.map((guess, i) => (
                <Row key={i} guess={guess} isFinal={true} dailyWord={dailyWord} wordLength={wordLength} />
            ))}
            {status === 'PLAYING' && (
                <Row guess={currentGuess} isFinal={false} dailyWord={dailyWord} wordLength={wordLength} />
            )}
            {Array.from({ length: Math.max(0, empties) }).map((_, i) => (
                <Row key={`empty-${i}`} guess={[]} isFinal={false} dailyWord={dailyWord} wordLength={wordLength} />
            ))}
        </div>
    );
}

function Row({ guess, isFinal, dailyWord, wordLength }) {
    const states = isFinal ? getStates(guess, dailyWord) : [];

    const cells = [];
    for (let i = 0; i < wordLength; i++) {
        const char = guess[i] || '';
        let state = 'empty';
        if (char) {
            state = isFinal ? states[i] : 'tbd';
        }
        cells.push(<Cell key={i} char={char} state={state} />);
    }
    return <div className="row">{cells}</div>;
}
