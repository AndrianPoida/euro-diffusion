import { MOTIF_DIVISION } from '../constants';
import { CityDTO } from '../models/city';
import { MotifDTO, MotifToPayDTO } from '../models/motif';
import * as _ from 'lodash';

export class City {
    public x: number;
    public y: number;
    public countryName: string;
    public motifs: MotifDTO[] = [];
    public transactions: MotifDTO[] = [];

    constructor(city: CityDTO) {
        Object.keys(city).forEach(key => {
            this[key] = city[key];
        });
    }

    receivePayment(motifsToPay: MotifToPayDTO[]) {
        motifsToPay.forEach(motifToPay => {
            const motif = this.transactions.find(motif => motif.name === motifToPay.name);
            if (motif) this.transactions[this.transactions.indexOf(motif)].balance += motifToPay.amount;
            else this.transactions.push({ name: motifToPay.name, balance: motifToPay.amount });
        });
    }

    makePayment() {
        const motifsToPay: MotifToPayDTO[] = [];
        this.motifs
            .filter(motif => Math.floor(motif.balance / MOTIF_DIVISION) >= 1)
            .forEach(motif => {
                const amount = Math.floor(motif.balance / MOTIF_DIVISION);
                const transaction = this.transactions.find(transaction => transaction.name === motif.name);
                const transactionIndex = this.transactions.indexOf(transaction);
                this.transactions[transactionIndex].balance -= amount;
                motifsToPay.push({ name: motif.name, amount });
            });
        return motifsToPay;
    }

    startTransaction() {
        this.transactions = _.cloneDeep(this.motifs);
    }

    finishTransaction() {
        this.motifs = _.cloneDeep(this.transactions);
        this.transactions = [];
    }

    isCompleted(countryNames: string[]) {
        return countryNames.every(
            countryName => this.motifs.find(motif => motif.name === countryName)
        );
    }
}