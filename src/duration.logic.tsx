import { DateTime, Interval } from "luxon";

const LAST_DAY_HOUR = (dateTime: DateTime) => DateTime.fromISO(dateTime.toISO()).set({ hour: 22 }).startOf('hour');//.startOf('minute');
const LAST_MORNING_NIGHT_HOUR = (dateTime: DateTime) => DateTime.fromISO(dateTime.toISO()).set({ hour: 8 }).startOf('hour');
const FIRST_EVENING_HOUR = (dateTime: DateTime) => DateTime.fromISO(dateTime.toISO()).set({ hour: 22 }).startOf('hour');
const LAST_NIGHT_HOUR = (dateTime: DateTime) => DateTime.fromISO(dateTime.toISO()).plus(({ day: 1 })).startOf('day');


export type ModulAutoTravelSegment = {
    date: DateTime,
    isSunday: boolean,
    dayHourCount: number,
    nightHourCount: number
};

function countDayHoursUntilTomorrow(dateTime: DateTime): number {
    if (dateTime.hour >= 22) {
        return 0;
    }
    if (dateTime.hour < 8) {
        return 14;
    }
    return Interval.fromDateTimes(dateTime, LAST_DAY_HOUR(dateTime)).length('hour');
}

function countNightHoursUntilTomorrow(dateTime: DateTime) {
    if (dateTime.hour < 8) {
        return 2 + Interval.fromDateTimes(dateTime, LAST_MORNING_NIGHT_HOUR(dateTime)).length('hour');
    }
    if (dateTime.hour >= 22) {
        return Interval.fromDateTimes(dateTime, LAST_NIGHT_HOUR(dateTime)).length('hour');
    }
    return 2;
}

function countDayHoursUntilEnd(dateTime: DateTime, end: DateTime): number {
    if (end.hour < 8 || (dateTime.hour > 22 && end.hour > 22)) {
        return 0;
    }
    const endTime = end.hour > 22 ? LAST_DAY_HOUR(end) : end.startOf('minute');
    if (dateTime.hour < 8) {
        return Interval.fromDateTimes(LAST_MORNING_NIGHT_HOUR(dateTime), endTime).length('hour');
    }
    return Interval.fromDateTimes(dateTime, endTime).length('hour');
}

function countNightHoursUntilEnd(dateTime: DateTime, end: DateTime): number {
    if (dateTime.hour >= 8 && end.hour < 22) {
        return 0;
    }
    if ((dateTime.hour < 8 && end.hour < 8)
        || (dateTime.hour >= 22 && end.hour >= 22)) {
        return Interval.fromDateTimes(dateTime, end).length('hour');
    }
    let ctr = 0;
    if (dateTime.hour < 8 && end.hour >= 8)
        ctr += Interval.fromDateTimes(dateTime, LAST_MORNING_NIGHT_HOUR(end)).length('hour');
    if (dateTime.hour < 22 && end.hour >= 22)
        ctr += Interval.fromDateTimes(FIRST_EVENING_HOUR(dateTime), end).length('hour');
    return ctr;
}

export function segmentTravelDurationByArray(start: DateTime, end: DateTime): ModulAutoTravelSegment[] {
    const travelSegments: ModulAutoTravelSegment[] = [];
    let travelContinue = true;
    let t = DateTime.fromMillis(start.toMillis());
    while (travelContinue) {
        const segment: ModulAutoTravelSegment = {
            date: DateTime.fromISO(t.toISO()),
            isSunday: t.weekday === 7,
            dayHourCount: countDayHoursUntilTomorrow(t),
            nightHourCount: countNightHoursUntilTomorrow(t)
        };
        if (end.hasSame(t, 'day')) {
            segment.dayHourCount = countDayHoursUntilEnd(t, end);
            segment.nightHourCount = countNightHoursUntilEnd(t, end);
            travelContinue = false;
        } else {
            t = t.plus({ day: 1 }).startOf('day');
        }
        travelSegments.push(segment);
    }
    return travelSegments;
}