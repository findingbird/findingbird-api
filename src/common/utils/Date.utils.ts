import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export class DateUtils {
  // 현재 시간 (KST) 기준
  static now(): Dayjs {
    return dayjs().tz();
  }

  // 어떤 날짜든 KST로 변환
  static toKst(d: Dayjs | Date | string): Dayjs {
    return dayjs(d).tz();
  }

  // KST로 포맷
  static format(d: Dayjs | Date | string, format: string = 'YYYY-MM-DD HH:mm:ss'): string {
    return this.toKst(d).format(format);
  }

  // UTC 저장용 Date 객체로 변환
  static toUtcDate(d: Dayjs | Date | string): Date {
    return this.toKst(d).utc().toDate();
  }
}
