export class S3ResponseDto {
  filename: string; // S3에 저장된 파일의 이름
  url: string; // S3에 업로드된 파일의 URL
  key: string; // S3에 저장된 파일의 키 (파일 이름)
}
