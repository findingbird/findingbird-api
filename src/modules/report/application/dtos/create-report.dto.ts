export class CreateReportDto {
  readonly userId: string;
  readonly title: string;
  readonly birdCount: number;
  readonly collisionSiteType: string;
  readonly mitigationApplied: boolean;
  readonly speciesInfo: string;
  readonly observationLocation: string;
  readonly description: string;
  readonly image: Express.Multer.File;
}
