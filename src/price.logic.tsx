import { DistanceSplitted } from './distance.logic';
import { ModulAutoTravelSegment } from './duration.logic';

import subscriberPrices from './assets/subscriber.prices.json';
import unsubscriberPrices from './assets/unsubscriber.prices.json';

type ModulAutoPriceRates = {
    category: string,
    duration: {
        hour: number,
        sunday: number
    },
    distance: {
        underHundred: number,
        underThreeHundreds: number,
        overThreeHundreds: number
    }
};

export function applyPrices(
    cat: string,
    subscriber: boolean,
    distanceSorted: DistanceSplitted,
    durationSorted: ModulAutoTravelSegment[]): number | any {
    console.log('subscriber', subscriber)
    const priceRates: ModulAutoPriceRates = (subscriber ? subscriberPrices : unsubscriberPrices).filter(({ category }) => category === cat)[0];
    return {
        cost: distanceSorted.over * priceRates.distance.overThreeHundreds
            + distanceSorted.underThreeHundreds * priceRates.distance.underThreeHundreds
            + distanceSorted.underHundred * priceRates.distance.underHundred
            + durationSorted.reduce((agg, { dayHourCount, nightHourCount, isSunday }) => {
                const hourPrice = isSunday ? priceRates.duration.sunday : priceRates.duration.hour;
                if (dayHourCount + nightHourCount >= 10) {
                    return agg + 10 * hourPrice;
                }
                return agg + hourPrice * dayHourCount + (nightHourCount * hourPrice) * 0.5;
            }, 0),
        distanceSorted,
        durationSorted,
        priceRates,
        cat,
        subscriber
    };
}