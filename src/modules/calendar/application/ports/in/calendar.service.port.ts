import { CalendarResultDto } from '~/modules/calendar/application/dtos/calendar-result.dto';
import { GetCalendarDto } from '~/modules/calendar/application/dtos/get-calendar.dto';

export const CALENDAR_SERVICE = Symbol('ICalendarService');

export interface ICalendarService {
  getCalendar(dto: GetCalendarDto): Promise<CalendarResultDto>;
}
