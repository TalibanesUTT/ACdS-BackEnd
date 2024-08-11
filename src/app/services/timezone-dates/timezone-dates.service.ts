import { Injectable } from "@nestjs/common";
import * as moment from "moment-timezone";

@Injectable()
export class TimezoneDatesService {
    private readonly timezone = "America/Mexico_City";

    convertToDate(date: string): Date {
        return moment.tz(date, "YYYY-MM-DD", this.timezone).toDate();
    }

    createDateFromDatetime(date: string): Date {
        return moment.tz(date, this.timezone).toDate();
    }

    formatStringToDateString(date: string): string {
        return moment.tz(date, this.timezone).format("DD/MM/YYYY");
    }

    formatDateToString(date: Date): string {
        return moment.tz(date, this.timezone).format("YYYY-MM-DD");
    }

    normalizedToDateOnly(date: Date): Date {
        return moment.tz(date, this.timezone).startOf("day").toDate();
    }

    getCurrentDate(): Date {
        return moment.tz(this.timezone).toDate();
    }

    getDayOfWeek(date: Date): string {
        return moment.tz(date, this.timezone).format("dddd");
    }

    getCurrentTimeString(date: Date): string {
        return moment.tz(date, this.timezone).format("HH:mm");
    }

    getMinutesFromDate(date: Date): number {
        return moment.tz(date, this.timezone).minutes();
    }

    getYear(date: Date): number {
        return moment.tz(date, this.timezone).year();
    }

    getMonth(date: Date): number {
        return moment.tz(date, this.timezone).month() + 1;
    }

    getMilliscendsSinceEpoch(date: Date): number {
        return moment.tz(date, this.timezone).valueOf();
    }

    addDaysToDate(date: Date, days: number): Date {
        return moment.tz(date, this.timezone).add(days, "days").toDate();
    }

    addRangeToDate(date: Date, hours: number, minutes: number): Date {
        return moment.tz(date, this.timezone).add(hours, "hours").add(minutes, "minutes").toDate();
    }

    setTimeToDate(date: Date, hours: number, minutes: number): Date {
        return moment.tz(date, this.timezone).set({ hours: hours, minutes: minutes, second: 0, millisecond: 0 }).toDate();
    }
    subtractTimeToDate(date: Date, hours: number, minutes: number, seconds: number, milliseconds: number): Date {
        return moment.tz(date, this.timezone).subtract(hours, "hours").subtract(minutes, "minutes").subtract(seconds, "seconds").subtract(milliseconds, "milliseconds").toDate();
    }

    isSameDay(first: Date, second: Date): boolean {
        const startOfFirstDay = moment.tz(first, this.timezone).startOf("day");
        const startOfSecondDay = moment.tz(second, this.timezone).startOf("day");

        return startOfFirstDay.isSame(startOfSecondDay);
    }
}
