import { InputReader } from './entities/input-reader';
import { EuroDiffusionSimulator } from './entities/euro-diffusion-simulator';

const runTask = () => {
    try {
        const inputReader = new InputReader('input.txt');
        const testCases = inputReader.getTestCases();
        testCases.forEach((testCase, indx) => {
            const simulator = new EuroDiffusionSimulator(testCase);
            simulator.simulate();
            console.log(`Case Number ${indx + 1}`);
            simulator.printResult();
        });
    } catch (e) {
        console.error('ERROR:', e.message);
    }
};
runTask();