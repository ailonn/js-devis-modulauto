
export type DistanceSplitted = {
    underHundred: number
    , underThreeHundreds: number
    , over: number
};

export function splitDistance(kms: number): DistanceSplitted {

    const underHundred: number = kms - 100 < 0 ?
        kms : 100;
    const underThreeHundreds: number = underHundred === kms ?
        0 : (kms - 300 < 0 ?
            kms - 100 : 200);
    const over: number = underThreeHundreds === kms || underHundred === kms || kms - 300 < 0
        ? 0 : kms - 300;
    if (kms !== (underHundred + underThreeHundreds + over)) {
        console.error(`error in splitDistance ${kms} must be equal
         to ${underHundred + underThreeHundreds + over}`);
    }
    return {
        underHundred
        , underThreeHundreds
        , over
    }
}