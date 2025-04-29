export class CreateRecordDto {
  userId: string;
  image: Express.Multer.File;
  name: string | null;
  district: string;
  size: string;
  color: string;
  locationDescription: string;
  goalId: string | null;
}
