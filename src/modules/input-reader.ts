import * as fs from 'fs';
import { CountryDTO } from '../models/country';

const getRules = (country: CountryDTO) => [
    country.xl <= country.xh,
    country.yl <= country.yh,
    country.xh <= 10,
    country.xl >= 1,
    country.yh <= 10,
    country.yl >= 1
];

const validateInput = (country: CountryDTO) => {
    if (getRules(country).some(x => !x)) {
        throw new Error('Input validation failed');
    }
};

export const getCases = (pathname: string) => {
    const file: string = fs.readFileSync(pathname, 'utf-8');
    const testCases = file
        .replace(/^\d+$/gm, 'task_start')
        .split('task_start')
        .map(testCase => testCase.split('\n').filter(x => x).map(rawCountry => {
            const countryValues = rawCountry.split(' ');
            const country: CountryDTO = {
                name: countryValues[0],
                xl: parseInt(countryValues[1]),
                yl: parseInt(countryValues[2]),
                xh: parseInt(countryValues[3]),
                yh: parseInt(countryValues[4]),
            };
            validateInput(country);
            return country;
        }))
        .filter(x => x.length);
    return testCases;
};