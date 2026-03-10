export const CONSONANTS = [
    ['p', 'b', 't', 'd', 'ʈ', 'ɖ', 'c', 'ɟ', 'k', 'g', 'q', 'ɢ'],
    ['m', 'ɱ', 'ʙ', 'n', 'ɾ', 'ɳ', 'ɽ', 'ɲ', 'ŋ', 'ɴ', 'ʀ', 'ʔ'],
    ['ɸ', 'f', 'θ', 'ð', 's', 'ʃ', 'ʂ', 'ç', 'x', 'χ', 'ħ', 'h'],
    ['β', 'v', 'ð', 'z', 'ʒ', 'ʐ', 'ʝ', 'ɣ', 'ʁ', 'ʕ', 'ɦ'],
    ['PAGE', 'w', 'ʋ', 'ɹ', 'l', 'ɭ', 'ɥ', 'j', 'ʎ', 'ɰ', 'BACKSPACE'],
    ['ENTER']
];

// Replaced 1/3 and 2/3 with just 'PAGE' to toggle
export const VOWELS = [
    ['i', 'y', 'ɨ', 'ʉ', 'ɯ', 'u'],
    ['ɪ', 'ʏ', 'ɪ̈', 'ʊ̈', 'ɯ̽', 'ʊ'],
    ['e', 'ø', 'ɘ', 'ɵ', 'ə', 'ɤ', 'o'],
    ['ɛ', 'œ', 'ɜ', 'ɞ', 'ɐ', 'ʌ', 'ɔ'],
    ['PAGE', 'æ', 'a', 'ɶ', 'ä', 'ɒ̈', 'ɑ', 'ɒ', 'BACKSPACE'],
    ['ENTER']
];

export const VARIATIONS = {
    'ʃ': ['ʃ', 'ʅ', 'tʃ', 'ɧ', 'ʆ'],
    'ʒ': ['ʒ', 'dʒ'],
    'e': ['e', 'ẽ'],
    'a': ['a', 'ã'],
    'i': ['i', 'ĩ'],
    'o': ['o', 'õ'],
    'u': ['u', 'ũ']
};

const allKeys = [
    ...CONSONANTS.flat(),
    ...VOWELS.flat(),
    ...Object.values(VARIATIONS).flat()
];

export const VALID_PHONEMES = new Set(
    allKeys.filter(k => k !== 'ENTER' && k !== 'BACKSPACE' && k !== 'PAGE')
);

// We keep KEYBOARD_ROWS as an alias for retro-compatibility if needed, 
// though we'll update Keyboard.jsx to use CONSONANTS/VOWELS directly.
export const KEYBOARD_ROWS = CONSONANTS;
