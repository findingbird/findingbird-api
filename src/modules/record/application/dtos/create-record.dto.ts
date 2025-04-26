export class CreateRecordDto {
  userId: string;
  image: Express.Multer.File;
  name: string | null;
  coordinate: string;
  size: string;
  color: string;
  locationDescription: string;
  isSuggested: boolean;
}
