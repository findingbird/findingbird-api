import { Module } from '@nestjs/common';

import { CALENDAR_SERVICE } from '~/modules/calendar/application/ports/in/calendar.service.port';
import { CalendarService } from '~/modules/calendar/application/services/calendar.service';
import { CalendarController } from '~/modules/calendar/presentation/https/calendar.controller';
import { GoalModule } from '~/modules/goal/goal.module';
import { RecordModule } from '~/modules/record/record.module';

@Module({
  imports: [RecordModule, GoalModule],
  controllers: [CalendarController],
  providers: [
    {
      provide: CALENDAR_SERVICE,
      useClass: CalendarService,
    },
  ],
  exports: [CALENDAR_SERVICE],
})
export class CalendarModule {}
