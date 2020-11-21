import { CountryDTO } from '../models/country';
import { City } from './city';
import { DEFAULT_BALANCE } from '../constants';

export class Country {
    public name: string;
    public cities: City[] = [];
    public daysForCompletion: number;
    private xl: number;
    private yl: number;
    private xh: number;
    private yh: number;

    constructor (country: CountryDTO) {
        Object.keys(country).forEach(key => {
            this[key] = country[key];
        });
        this.createCities();
    }

    private createCities () {
        for (let y = this.yl; y <= this.yh; y++) {
            for (let x = this.xl; x <= this.xh; x++) {
                this.cities.push(new City({
                    x,
                    y,
                    motifs: [{ name: this.name, balance: DEFAULT_BALANCE }],
                    countryName: this.name
                }));
            }
        }
    }

    allCitiesCompleted (countries: Country[]) {
        const countryNames = countries.map(country => country.name);
        return this.cities.every(city => city.isCompleted(countryNames));
    }
}