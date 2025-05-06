import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { BIRD_SERVICE, IBirdService } from '~/modules/bird/application/ports/in/bird.service.port';
import { BirdResponseDto } from '~/modules/bird/presentation/http/dtos/bird.response';

@Controller('bird')
export class BirdController {
  constructor(
    @Inject(BIRD_SERVICE)
    private readonly birdService: IBirdService
  ) {}

  @Get('/')
  @ApiOperation({
    summary: '영문이름으로 새 조회',
    description: '영문이름(scientific name)으로 새를 조회합니다. 해당 이름의 새가 없으면 404 에러를 반환합니다.',
  })
  @ApiParam({
    name: 'scientificName',
    description: '영문이름(scientific name)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '영문이름으로 새 조회 성공',
    type: BirdResponseDto,
  })
  async getBirdByScientificName(@Param('scientificName') scientificName: string): Promise<BirdResponseDto> {
    const bird = await this.birdService.getBirdByScientificName({ scientificName });
    return BirdResponseDto.fromData(bird);
  }
}
