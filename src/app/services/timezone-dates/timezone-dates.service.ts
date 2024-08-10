import { Injectable } from "@nestjs/common";
import * as moment from "moment-timezone";

@Injectable()
export class TimezoneDatesService {
    private readonly timezone = "America/Mexico_City";

    convertToDate(date: string): Date {
        return moment(date, "YYYY-MM-DD").toDate();
    }

    createDateFromDatetime(date: string): Date {
        return moment(date).toDate();
    }

    formatStringToDateString(date: string): string {
        return moment(date).format("DD/MM/YYYY");
    }

    formatDateToString(date: Date): string {
        return moment(date).format("YYYY-MM-DD");
    }

    getCurrentDate(): Date {
        return moment.tz(this.timezone).toDate();
    }

    getDayOfWeek(date: Date): string {
        return moment(date).format("dddd");
    }

    getCurrentTimeString(date: Date): string {
        return moment(date).format("HH:mm");
    }

    getMinutesFromDate(date: Date): number {
        return moment(date).minutes();
    }

    addDaysToDate(date: Date, days: number): Date {
        return moment(date).add(days, "days").toDate();
    }

    addRangeToDate(date: Date, hours: number, minutes: number): Date {
        return moment(date).add(hours, "hours").add(minutes, "minutes").toDate();
    }

    setTimeToDate(date: Date, hours: number, minutes: number): Date {
        return moment(date).set({ hours: hours, minutes: minutes, second: 0, millisecond: 0 }).toDate();
    }

    subtractTimeToDate(date: Date, hours: number, minutes: number, seconds: number, milliseconds: number): Date {
        return moment(date).subtract(hours, "hours").subtract(minutes, "minutes").subtract(seconds, "seconds").subtract(milliseconds, "milliseconds").toDate();
    }

    isSameDay(first: Date, second: Date): boolean {
        const startOfFirstDay = moment(first).startOf("day");
        const startOfSecondDay = moment(second).startOf("day");

        return startOfFirstDay.isSame(startOfSecondDay);
    }
}