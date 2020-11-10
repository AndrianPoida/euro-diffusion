import * as _ from 'lodash';
import { CountryDTO } from '../models/country';
import { Country } from '../entities/country';
import { City } from '../entities/city';

export class EuroDiffusionSimulator {
    private countries: Country[] = [];
    private cities: City[] = [];

    constructor(countriesGeneralData: CountryDTO[]) {
        countriesGeneralData.forEach(country => this.countries.push(new Country(country)));
        this.cities = _.flatMap(this.countries, (country: Country) => country.cities);
    }

    allCountriesCompleted() {
        return this.countries.every(country => !_.isUndefined(country.daysForCompletion));
    }

    setCompletionDaysForCompletedCountries(day: number) {
        this.countries.forEach(country => {
            if (!_.isUndefined(country.daysForCompletion)) return;
            if (country.allCitiesCompleted(this.countries)) {
                country.daysForCompletion = day;
            }
        });
    }

    findNeighbours(city: City) {
        return this.cities.filter(anotherCity =>
            !(anotherCity.x === city.x && anotherCity.y === city.y) && (
                (
                    Math.abs(city.x - anotherCity.x) === 1 &&
                    Math.abs(city.y - anotherCity.y) === 0
                ) ||
                (
                    Math.abs(city.x - anotherCity.x) === 0 &&
                    Math.abs(city.y - anotherCity.y) === 1
                )
            )
        );
    }

    makeMotifsExchange(city1: City, city2: City) {
        const city1MotifsToPay = city1.makePayment();
        city2.receivePayment(city1MotifsToPay);
        const city2MotifsToPay = city2.makePayment();
        city1.receivePayment(city2MotifsToPay);
    }

    startTransactionsForEachCity() {
        this.cities.forEach(city => city.startTransaction());
    }

    finishTransactionsForEachCity() {
        this.cities.forEach(city => city.finishTransaction());
    }

    simulate() {
        let day = 0;
        while (true) {
            this.setCompletionDaysForCompletedCountries(day);
            if (this.allCountriesCompleted()) return;
            this.startTransactionsForEachCity();
            const paidOffCities: City[] = [];
            this.cities.forEach(city => {
                const neighbours = this.findNeighbours(city)
                    .filter(neighbour => !paidOffCities.includes(neighbour));
                neighbours.forEach(neighbour => this.makeMotifsExchange(city, neighbour));
                paidOffCities.push(city);
            });
            this.finishTransactionsForEachCity();
            day++;
        }
    }

    printResult() {
        const sortedCountries: Country[] = _.orderBy(
            this.countries,
            ['daysForCompletion', 'name'],
            ['asc', 'asc']
        );
        sortedCountries.map(country => console.log(country.name, country.daysForCompletion));
    }
}