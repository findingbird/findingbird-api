import { Dayjs } from 'dayjs';

export class CreateRecordForOnboardingDto {
  readonly userId: string;
  readonly image: Express.Multer.File;
  readonly name: string | null;
  readonly district: string;
  readonly size: string;
  readonly color: string;
  readonly locationDescription: string;
  readonly createdAt: Dayjs;
}
