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

export type ModulAutoTravelCost = {
    subscriber: {
        full: number
    },
    unsubscriber: {
        full: number
    }
}

function travelDetailsByPriceRate(priceRates: ModulAutoPriceRates, distanceSorted: DistanceSplitted, durationSorted: ModulAutoTravelSegment[]): number {
    return distanceSorted.over * priceRates.distance.overThreeHundreds
        + distanceSorted.underThreeHundreds * priceRates.distance.underThreeHundreds
        + distanceSorted.underHundred * priceRates.distance.underHundred
        + durationSorted.reduce((agg, { dayHourCount, nightHourCount, isSunday }) => {
            const hourPrice = isSunday ? priceRates.duration.sunday : priceRates.duration.hour;
            if (dayHourCount + nightHourCount >= 10) {
                return agg + 10 * hourPrice;
            }
            return agg + hourPrice * dayHourCount + (nightHourCount * hourPrice) * 0.5;
        }, 0)
        + 1.5;
}

export function applyPrices(
    cat: string,
    distanceSorted: DistanceSplitted,
    durationSorted: ModulAutoTravelSegment[]): ModulAutoTravelCost {
    const subscriberPriceRates: ModulAutoPriceRates = subscriberPrices.filter(({ category }) => category === cat)[0];
    const unsubscriberPriceRates: ModulAutoPriceRates = unsubscriberPrices.filter(({ category }) => category === cat)[0];
    return {
        subscriber: {
            full: travelDetailsByPriceRate(subscriberPriceRates, distanceSorted, durationSorted)
        },
        unsubscriber: {
            full: travelDetailsByPriceRate(unsubscriberPriceRates, distanceSorted, durationSorted)
        }
    };
}