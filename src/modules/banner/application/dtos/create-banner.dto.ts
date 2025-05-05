export class CreateBannerDto {
  readonly title: string;
  readonly image: Express.Multer.File;
  readonly link: string;
}
