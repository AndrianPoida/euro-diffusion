import * as fs from 'fs';
import * as _ from 'lodash';
import { CountryDTO } from '../models/country';

export class InputReader {
    private pathname: string;

    constructor(pathname: string) {
        this.pathname = pathname;
    }

    private getCountryPoisitionRules (country: CountryDTO) {
        return [
            country.xl <= country.xh,
            country.yl <= country.yh,
            country.xh <= 10,
            country.xl >= 1,
            country.yh <= 10,
            country.yl >= 1
        ];
    }

    private countryHasNeighbours (countries: CountryDTO[], country: CountryDTO) {
        return countries.some(anotherCountry =>
            !(
                anotherCountry.xl === country.xl && anotherCountry.yl === country.yl &&
                anotherCountry.xh === country.xh && anotherCountry.yh === country.yh
            ) && (
                (
                    Math.abs(country.yh - anotherCountry.yl) === 1 &&
                    country.xl <= anotherCountry.xh &&
                    country.xh >= anotherCountry.xl
                ) ||
                (
                    Math.abs(country.yl - anotherCountry.yh) === 1 &&
                    country.xl <= anotherCountry.xh &&
                    country.xh >= anotherCountry.xl
                ) ||
                (
                    Math.abs(country.xl - anotherCountry.xh) === 1 &&
                    country.yh >= anotherCountry.yl &&
                    country.yl <= anotherCountry.yh
                ) ||
                (
                    Math.abs(country.xh - anotherCountry.xl) === 1 &&
                    country.yh >= anotherCountry.yl &&
                    country.yl <= anotherCountry.yh
                )
            )
        );
    }

    private countryHasUniqueCoordinates (countries: CountryDTO[], country: CountryDTO) {
        return countries.every(anotherCountry =>
            (
                anotherCountry.xl === country.xl && anotherCountry.yl === country.yl &&
                anotherCountry.xh === country.xh && anotherCountry.yh === country.yh
            ) ||
            (
                (anotherCountry.xh > country.xh && anotherCountry.xl > country.xh) ||
                (anotherCountry.yh > country.yh && anotherCountry.yl > country.yh) ||
                (anotherCountry.xl < country.xl && anotherCountry.xh < country.xl) ||
                (anotherCountry.yl < country.yl && anotherCountry.yh < country.yl)
            )
        );
    }

    private getCountriesRules (countries: CountryDTO[]) {
        return [
            {
                rule: _.uniqBy(countries, 'name').length === countries.length,
                message: 'Country name should be unique'
            },
            {
                rule: countries.every(country => this.getCountryPoisitionRules(country).every(x => x)),
                message: 'One or more countries have invalid coordinates'
            },
            {
                rule: countries.length <= 1 || countries.every(country => this.countryHasNeighbours(countries, country)),
                message: 'Each country should have at least one neighbour'
            },
            {
                rule: countries.every(country => this.countryHasUniqueCoordinates(countries, country)),
                message: 'Each country should have unique coordinates'
            }
        ];
    }

    private validateCountries (countries: CountryDTO[]) {
        this.getCountriesRules(countries).forEach(item => {
            if (!item.rule) {
                throw new Error(item.message);
            }
        });
        return countries;
    }

    getTestCases () {
        const file: string = fs.readFileSync(this.pathname, 'utf-8');
        const testCases = file
            .replace(/^\d+$/gm, 'task_start')
            .split('task_start')
            .map(testCase => this.validateCountries(
                testCase
                    .split('\n')
                    .filter(x => x)
                    .map(rawCountry => {
                        const countryValues = rawCountry.split(' ');
                        const country: CountryDTO = {
                            name: countryValues[0],
                            xl: parseInt(countryValues[1]),
                            yl: parseInt(countryValues[2]),
                            xh: parseInt(countryValues[3]),
                            yh: parseInt(countryValues[4]),
                        };
                        return country;
                    })
            ))
            .filter(testCase => testCase.length);
        return testCases;
    };
}