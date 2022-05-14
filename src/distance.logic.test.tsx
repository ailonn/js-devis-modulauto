
import {
    splitDistance
} from './distance.logic';



describe('splitDistance should detect distance under 100kms and under 300kms and over',
    () => {
        test('split 1km to 1 / 0 / 0', () => {
            expect(splitDistance(1))
                .toEqual({
                    'underHundred': 1,
                    'underThreeHundreds': 0,
                    'over': 0
                });
        });
        test('split 99km to 99 / 0 / 0', () => {
            expect(splitDistance(99))
                .toEqual({
                    'underHundred': 99,
                    'underThreeHundreds': 0,
                    'over': 0
                });
        });
        test('split 100km to 100 / 0 / 0', () => {
            expect(splitDistance(100))
                .toEqual({
                    'underHundred': 100,
                    'underThreeHundreds': 0,
                    'over': 0
                });
        });
        test('split 101km to 100 / 1 / 0', () => {
            expect(splitDistance(101))
                .toEqual({
                    'underHundred': 100,
                    'underThreeHundreds': 1,
                    'over': 0
                });
        });
        test('split 299kms to 100 / 199 / 0', () => {
            expect(splitDistance(299))
                .toEqual({
                    'underHundred': 100,
                    'underThreeHundreds': 199,
                    'over': 0
                });
        });
        test('split 300kms to 100 / 200 / 0', () => {
            expect(splitDistance(300))
                .toEqual({
                    'underHundred': 100,
                    'underThreeHundreds': 200,
                    'over': 0
                });
        });
        test('split 301kms to 100 / 200 / 1', () => {
            expect(splitDistance(301))
                .toEqual({
                    'underHundred': 100,
                    'underThreeHundreds': 200,
                    'over': 1
                });
        });
        test('split 3333kms to 100 / 200 / 3033', () => {
            expect(splitDistance(3333))
                .toEqual({
                    'underHundred': 100,
                    'underThreeHundreds': 200,
                    'over': 3033
                });
        });
    });

