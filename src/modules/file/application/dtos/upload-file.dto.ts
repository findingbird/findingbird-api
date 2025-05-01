export class UploadFileDto {
  file: Express.Multer.File;
  directory?: string; // 파일 저장 디렉토리 (기본값: 'uploads')
  allowedTypes?: string[]; // 허용된 MIME 타입 (기본값: 모든 타입)
  maxSize?: number; // 최대 파일 크기 (bytes) (기본값: 5MB)
}
