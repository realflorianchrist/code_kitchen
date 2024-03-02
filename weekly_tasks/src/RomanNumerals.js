const ROMAN_NUMERALS = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
};

function convertRomanNumeralsToNumber(numeral) {
    let split_numeral = [...numeral];
    let value = 0;

    for (let i = 0; i < split_numeral.length; i++) {
        let currentNumeral = ROMAN_NUMERALS[split_numeral[i]];
        let nextNumeral = ROMAN_NUMERALS[split_numeral[i + 1]];

        if (nextNumeral > currentNumeral) {
            value += nextNumeral - currentNumeral;
            i++;
        } else {
            value += currentNumeral;
        }
    }

    return value;
}

console.log(convertRomanNumeralsToNumber("IV"));

const convertRomanNumeralsToNumberLambda = numeral => {
    let split_numeral = [...numeral];
    let value = 0;

    for (let i = 0; i < split_numeral.length; i++) {
        let currentNumeral = ROMAN_NUMERALS[split_numeral[i]];
        let nextNumeral = ROMAN_NUMERALS[split_numeral[i + 1]];

        if (nextNumeral > currentNumeral) {
            value += nextNumeral - currentNumeral;
            i++;
        } else {
            value += currentNumeral;
        }
    }

    return value;
}

console.log(convertRomanNumeralsToNumberLambda("IV"));
