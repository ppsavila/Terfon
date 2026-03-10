import { useState, useEffect } from 'react';
import { DAILY_WORDS } from '../data/words.js';
import { KEYBOARD_ROWS, VALID_PHONEMES } from '../data/phonemes.js';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const START_DATE = new Date('2026-03-10T00:00:00-03:00').getTime();

const getDayIndex = () => {
    const now = new Date();
    // Adjust to local timezone (BRT usually) to avoid reset weirdness, or just use absolute time delta
    const diffTime = Math.abs(now.getTime() - START_DATE);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

const getDailyWord = (index) => DAILY_WORDS[index % DAILY_WORDS.length];

const getTodayDateString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

export const useTerfon = () => {
    const [dayIndex, setDayIndex] = useState(getDayIndex());
    const [dailyWord, setDailyWord] = useState(getDailyWord(dayIndex));

    const [guesses, setGuesses] = useState(() => {
        const saved = localStorage.getItem('terfon-state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.date === getTodayDateString()) {
                    return parsed.guesses || [];
                }
            } catch (e) { }
        }
        return [];
    });

    const [currentGuess, setCurrentGuess] = useState([]);

    const [status, setStatus] = useState(() => {
        const saved = localStorage.getItem('terfon-state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.date === getTodayDateString()) {
                    return parsed.status || 'PLAYING';
                }
            } catch (e) { }
        }
        return 'PLAYING';
    });

    // Save to local storage whenever guesses or status change
    useEffect(() => {
        localStorage.setItem('terfon-state', JSON.stringify({
            date: getTodayDateString(),
            guesses,
            status
        }));
    }, [guesses, status]);

    const onKeyPress = (key) => {
        if (status !== 'PLAYING') return;

        if (key === 'BACKSPACE') {
            setCurrentGuess((prev) => prev.slice(0, -1));
            return;
        }

        if (key === 'ENTER') {
            if (currentGuess.length !== WORD_LENGTH) {
                // Not enough phonemes - show a shake animation via another hook or state, but for now ignore
                return;
            }

            const newGuesses = [...guesses, currentGuess];
            setGuesses(newGuesses);
            setCurrentGuess([]);

            const isWon = currentGuess.join('') === dailyWord.join('');
            if (isWon) {
                setStatus('WON');
            } else if (newGuesses.length >= MAX_ATTEMPTS) {
                setStatus('LOST');
            }
            return;
        }

        if (currentGuess.length < WORD_LENGTH) {
            setCurrentGuess((prev) => [...prev, key]);
        }
    };

    // Compute keyboard state
    const keyboardState = {};
    guesses.forEach(guess => {
        guess.forEach((phoneme, i) => {
            // Determine state for letter
            let state = 'absent';
            if (dailyWord[i] === phoneme) {
                state = 'correct';
            } else if (dailyWord.includes(phoneme)) {
                state = 'present';
            }
            // Only upgrade state (absent -> present -> correct)
            if (state === 'correct' || (state === 'present' && keyboardState[phoneme] !== 'correct')) {
                keyboardState[phoneme] = state;
            } else if (state === 'absent' && !keyboardState[phoneme]) {
                keyboardState[phoneme] = state;
            }
        });
    });

    return {
        dailyWord,
        guesses,
        currentGuess,
        status,
        onKeyPress,
        keyboardState,
        MAX_ATTEMPTS,
        WORD_LENGTH
    };
};
