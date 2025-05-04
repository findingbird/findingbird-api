import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '~/common/guards/jwt-auth-guard';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { CALENDAR_SERVICE, ICalendarService } from '~/modules/calendar/application/ports/in/calendar.service.port';
import { CalendarResponseDto } from '~/modules/calendar/presentation/https/dtos/calendar.response.dto';
import { GetCalendarRequestQueryDto } from '~/modules/calendar/presentation/https/dtos/get-calendar.request.dto';

@Controller('calendar')
export class CalendarController {
  constructor(
    @Inject(CALENDAR_SERVICE)
    private readonly calendarService: ICalendarService
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '달력 조회',
    description:
      '월 단위로 관찰 기록 및 목표 목록을 조회합니다. 모든 날짜에 대한 응답이 담겨있으며 해당 날짜에 목표 및 기록이 없을 경우 빈 배열이 반환됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '달력 조회 성공',
    type: CalendarResponseDto,
  })
  async getCalendar(@Req() req: UserRequest, @Query() query: GetCalendarRequestQueryDto): Promise<CalendarResponseDto> {
    const { userId } = req.user;
    const { year, month } = query;
    const calendarData = await this.calendarService.getCalendar({ userId, year, month });
    return CalendarResponseDto.fromData(calendarData);
  }
}
