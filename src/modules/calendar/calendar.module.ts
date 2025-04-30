import { Module } from '@nestjs/common';

import { CalendarService } from '~/modules/calendar/application/services/calendar.service';
import { CalendarController } from '~/modules/calendar/presentation/https/calendar.controller';
import { GoalModule } from '~/modules/goal/goal.module';
import { RecordModule } from '~/modules/record/record.module';

@Module({
  imports: [RecordModule, GoalModule],
  controllers: [CalendarController],
  providers: [CalendarService],
  exports: [],
})
export class CalendarModule {}
