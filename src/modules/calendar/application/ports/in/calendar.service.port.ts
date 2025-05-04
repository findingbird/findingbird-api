import { CalendarResultDto } from '~/modules/calendar/application/dto/calendar-result.dto';
import { GetCalendarDto } from '~/modules/calendar/application/dto/get-calendar.dto';

export const CALENDAR_SERVICE = Symbol('ICalendarService');

export interface ICalendarService {
  getCalendar(dto: GetCalendarDto): Promise<CalendarResultDto>;
}
