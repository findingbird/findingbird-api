export class CreateRecordDto {
  readonly userId: string;
  readonly image: Express.Multer.File;
  readonly name: string | null;
  readonly district: string;
  readonly size: string;
  readonly color: string;
  readonly locationDescription: string;
  readonly goalId: string | null;
}
