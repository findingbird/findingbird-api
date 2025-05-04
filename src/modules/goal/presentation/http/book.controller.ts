import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '~/common/guards/jwt-auth-guard';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { GOAL_SERVICE, IGoalService } from '~/modules/goal/application/ports/in/goal.service.port';
import { BookResponseDto } from '~/modules/goal/presentation/http/dtos/book.response.dto';

@Controller('book')
export class BookController {
  constructor(
    @Inject(GOAL_SERVICE)
    private readonly goalService: IGoalService
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '도감 조회',
    description: '도감을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '도감 조회 성공',
    type: BookResponseDto,
  })
  async getBook(@Req() req: UserRequest): Promise<BookResponseDto> {
    const { userId } = req.user;
    const book = await this.goalService.getBook({ userId });
    return BookResponseDto.fromData(book);
  }
}
