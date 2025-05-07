import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { BIRD_SERVICE, IBirdService } from '~/modules/bird/application/ports/in/bird.service.port';
import { BirdResponseDto } from '~/modules/bird/presentation/http/dtos/bird.response';
import { getBirdByScientificNameRequestQueryDto } from '~/modules/bird/presentation/http/dtos/get-bird-by-scientific-name.request.dto';

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
  @ApiResponse({
    status: 200,
    description: '영문이름으로 새 조회 성공',
    type: BirdResponseDto,
  })
  async getBirdByScientificName(@Query() query: getBirdByScientificNameRequestQueryDto): Promise<BirdResponseDto> {
    const { scientificName } = query;
    const bird = await this.birdService.getBirdByScientificName({ scientificName });
    return BirdResponseDto.fromData(bird);
  }
}
