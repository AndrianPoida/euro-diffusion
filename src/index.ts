import { getCases } from './modules/input-reader';
import { EuroDiffusionSimulator } from './entities/euro-diffusion-simulator';

const runTask = () => {
    try {
        const testCases = getCases('input.txt');
        testCases.forEach((testCase, indx) => {
            const simulator = new EuroDiffusionSimulator(testCase);
            simulator.simulate();
            console.log(`Case Number ${indx + 1}`);
            simulator.printResult();
        });
    } catch (e) {
        console.error('ERROR:', e);
    }
};
runTask();