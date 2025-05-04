import { BirdResultDto } from '~/modules/bird/application/dtos/bird-result.dto';

export class BookResultDto {
  birds: BirdInBookDataDto[];
}

export class BirdInBookDataDto {
  isFound: boolean;
  bird: BirdResultDto;
}
