import { DateTime } from 'luxon';
import { segmentTravelDurationByArray } from './duration.logic';

type SegmentTravelAggregationType = {
    hours: number,
    nightHours: number,
    days: number,
    sundays: number,
    sundayHours: number,
    sundayNightHours: number,
};

function segmentTravelDuration(start: DateTime, end: DateTime): SegmentTravelAggregationType {
    const segments = segmentTravelDurationByArray(start.startOf('minute'), end.startOf('minute'));
    return segments.reduce((agg, { dayHourCount, nightHourCount, isSunday }) => {
        if (dayHourCount + nightHourCount >= 10) {
            if (isSunday) {
                agg.sundays++;
            } else {
                agg.days++;
            }
        } else {
            if (isSunday) {
                agg.sundayNightHours += nightHourCount;
                agg.sundayHours += dayHourCount;
            } else {
                agg.nightHours += nightHourCount;
                agg.hours += dayHourCount;
            }
        }
        return agg;
    }, {

        hours: 0,
        nightHours: 0,
        days: 0,
        sundays: 0,
        sundayHours: 0,
        sundayNightHours: 0,
    });
}

describe('segmentTravelDuration should segment the travel interval between domain rules', () => {
    describe('travel on one day of the week, the 2022/05/05', () => {
        let travelDay: DateTime = DateTime.fromISO('2022-05-05');
        beforeEach(() => {
            travelDay = DateTime.fromISO('2022-05-05');
        });
        test('segment the travel which start at 12:00 and finish at 13:00, detect daily hour', () => {
            travelDay = travelDay.set({ hour: 12 });
            const end = DateTime.fromISO(travelDay.toISO()).plus(({ hour: 1 }))
            expect(segmentTravelDuration(travelDay, end))
                .toEqual({
                    hours: 1,
                    nightHours: 0,
                    days: 0,
                    sundays: 0,
                    sundayHours: 0,
                    sundayNightHours: 0,
                });
        });
        test('segment the travel which start at 7:00 and finish at 9:00, detect night hour in the morning', () => {
            travelDay = travelDay.set({ hour: 7 }).startOf('hour');
            const end = DateTime.fromISO(travelDay.toISO()).plus(({ hour: 2 }))
            expect(segmentTravelDuration(travelDay, end))
                .toEqual({
                    hours: 1,
                    nightHours: 1,
                    days: 0,
                    sundays: 0,
                    sundayHours: 0,
                    sundayNightHours: 0,
                });
        });
        test('segment the travel which start at 21:00 and finish at 23:00, detect night hour in the evening', () => {
            travelDay = travelDay.set({ hour: 21 }).startOf('hour');
            const end = DateTime.fromISO(travelDay.toISO()).plus(({ hour: 2 }))
            expect(segmentTravelDuration(travelDay, end))
                .toEqual({
                    hours: 1,
                    nightHours: 1, //  a tester sur modulauto directement pour confirmer le comportement
                    days: 0,
                    sundays: 0,
                    sundayHours: 0,
                    sundayNightHours: 0,
                });
        });
        test('detect a travel of one day when its duration exceed 10 hours', () => {
            travelDay = travelDay.set({ hour: 11 });
            const end = DateTime.fromISO(travelDay.toISO()).plus(({ hour: 12 }))
            expect(segmentTravelDuration(travelDay, end))
                .toEqual({
                    hours: 0,
                    nightHours: 0,
                    days: 1,
                    sundays: 0,
                    sundayHours: 0,
                    sundayNightHours: 0,
                });
        });
    });

    describe('travel 24h', () => {
        test('detect a travel of 2 days when its duration exceed 24 hours', () => {
            const start = DateTime.fromISO("2022-05-09T12:12:00.000+02:00");
            const end = DateTime.fromISO("2022-05-10T12:12:00.000+02:00");
            expect(segmentTravelDuration(start, end))
                .toEqual({
                    hours: 0,
                    nightHours: 0,
                    days: 2,
                    sundays: 0,
                    sundayHours: 0,
                    sundayNightHours: 0,
                });
        });

        test('detect a travel of 1 day and 1 sunday when its duration exceed 24 hours', () => {
            const start = DateTime.fromISO("2022-05-08T12:12:00.000+02:00");
            const end = DateTime.fromISO("2022-05-09T12:12:00.000+02:00");
            expect(segmentTravelDuration(start, end))
                .toEqual({
                    hours: 0,
                    nightHours: 0,
                    days: 1,
                    sundays: 1,
                    sundayHours: 0,
                    sundayNightHours: 0,
                });
        });
    });

    describe('travel 13h on 2 days', () => {
        test('detect a travel of 2 days when its duration exceed 24 hours', () => {
            const start = DateTime.fromISO("2022-05-09T23:00:00.000+02:00");
            const end = DateTime.fromISO("2022-05-10T12:12:00.000+02:00");
            expect(segmentTravelDuration(start, end))
                .toEqual({
                    hours: 0,
                    nightHours: 1,
                    days: 1,
                    sundays: 0,
                    sundayHours: 0,
                    sundayNightHours: 0,
                });
        });

        test('detect a travel of 1 day and 1 sunday when its duration exceed 24 hours', () => {
            const start = DateTime.fromISO("2022-05-08T23:00:00.000+02:00");
            const end = DateTime.fromISO("2022-05-09T12:12:00.000+02:00");
            expect(segmentTravelDuration(start, end))
                .toEqual({
                    hours: 0,
                    nightHours: 0,
                    days: 1,
                    sundays: 0,
                    sundayHours: 0,
                    sundayNightHours: 1,
                });
        });
    });
    test('travel one week, should detect 6 days and 1 sunday', () => {
        const start = DateTime.fromISO("2022-05-02T10:00:00.000+02:00");
        const end = DateTime.fromISO("2022-05-08T18:00:00.000+02:00");
        expect(segmentTravelDuration(start, end))
            .toEqual({
                hours: 0,
                nightHours: 0,
                days: 6,
                sundays: 1,
                sundayHours: 0,
                sundayNightHours: 0,
            });
    });
});