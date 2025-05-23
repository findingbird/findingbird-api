import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '~/common/guards/jwt-auth-guard';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { GOAL_SERVICE, IGoalService } from '~/modules/goal/application/ports/in/goal.service.port';
import { CreateGoalRequestDto } from '~/modules/goal/presentation/http/dtos/create-goal.request.dto';
import { GoalResponseDto } from '~/modules/goal/presentation/http/dtos/goal.response.dto';

@Controller('goal')
export class GoalController {
  constructor(
    @Inject(GOAL_SERVICE)
    private readonly goalService: IGoalService
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '오늘의 목표 조회',
    description: '오늘 생성된 목표 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '오늘의 목표 조회 성공',
    type: [GoalResponseDto],
  })
  async getGoalsByDay(@Req() req: UserRequest): Promise<GoalResponseDto[]> {
    const { userId } = req.user;
    const goalWithBirds = await this.goalService.getTodayGoals({ userId });
    return goalWithBirds.map((goalWithBird) => GoalResponseDto.fromData(goalWithBird));
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '목표 생성',
    description: '목표를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '목표 생성 성공',
    type: GoalResponseDto,
  })
  async createGoal(@Req() req: UserRequest, @Body() body: CreateGoalRequestDto): Promise<GoalResponseDto> {
    const { userId } = req.user;
    const { district } = body;
    const goalWithBird = await this.goalService.createGoal({ userId, district });
    return GoalResponseDto.fromData(goalWithBird);
  }
}
