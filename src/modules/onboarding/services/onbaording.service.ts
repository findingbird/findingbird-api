import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

import { DateUtils } from '~/common/utils/Date.utils';
import { BIRD_SERVICE, IBirdService } from '~/modules/bird/application/ports/in/bird.service.port';
import { OnboardingDto } from '~/modules/onboarding/application/dtos/onboarding.dto';
import { IOnboardingService } from '~/modules/onboarding/application/ports/in/onboarding.service.port';
import {
  IRecordForOnboardingService,
  RECORD_FOR_ONBOARDING_SERVICE,
} from '~/modules/record/application/ports/in/record-for-onboarding.service.port';

@Injectable()
export class OnboardingService implements IOnboardingService {
  constructor(
    @Inject(RECORD_FOR_ONBOARDING_SERVICE)
    private readonly recordService: IRecordForOnboardingService,
    @Inject(BIRD_SERVICE)
    private readonly birdService: IBirdService
  ) {}

  async onboarding(dto: OnboardingDto): Promise<void> {
    const { userId } = dto;

    const birds = await this.birdService.getFrequentlySeenBirds();
    const now = DateUtils.now();

    // 기록 15개 랜덤 생성
    for (let i = 0; i < 15; i++) {
      const randomBird = birds[Math.floor(Math.random() * birds.length)];
      const randomDate = now.subtract(Math.floor(Math.random() * 30), 'days');

      let imageFile: Express.Multer.File;
      try {
        imageFile = await this.createFileFromUrl(randomBird.imageUrl);
      } catch (_error) {
        continue;
      }

      await this.recordService.createRecordForOnboarding({
        userId,
        image: imageFile,
        name: randomBird.speciesName,
        district: randomBird.districts.length > 0 ? randomBird.districts[0] : '중구',
        size: ['크다', '중간', '작다'][Math.floor(Math.random() * 3)],
        color: ['빨강', '파랑', '노랑', '초록', '검정'][Math.floor(Math.random() * 5)],
        locationDescription: ['나무 위', '풀밭', '하늘', '집 앞'][Math.floor(Math.random() * 4)],
        createdAt: randomDate,
      });
    }
  }

  private async createFileFromUrl(imageUrl: string): Promise<Express.Multer.File> {
    try {
      // 이미지 다운로드
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

      // 파일명 추출 (URL의 마지막 부분)
      const originalname = path.basename(imageUrl);

      // MIME 타입 추출 (응답 헤더에서)
      const contentType = response.headers['content-type'] || 'image/jpeg';

      // 버퍼에서 스트림 생성
      const buffer = Buffer.from(response.data);

      // Multer File 객체 생성
      const file: Express.Multer.File = {
        fieldname: 'image',
        originalname,
        encoding: '7bit',
        mimetype: contentType,
        size: buffer.length,
        buffer: buffer,
        stream: Readable.from(buffer), // buffer에서 Readable 스트림 생성
        destination: '',
        filename: originalname,
        path: '',
      };

      return file;
    } catch (_error) {
      const sampleImages = [
        path.join(process.cwd(), 'src/modules/onboarding/resources/bird1.jpg'),
        path.join(process.cwd(), 'src/modules/onboarding/resources/bird2.jpg'),
        path.join(process.cwd(), 'src/modules/onboarding/resources/bird3.jpg'),
        path.join(process.cwd(), 'src/modules/onboarding/resources/bird4.jpg'),
        path.join(process.cwd(), 'src/modules/onboarding/resources/bird5.jpg'),
      ];
      const randomIndex = Math.floor(Math.random() * sampleImages.length);
      return this.createFileFromLocalPath(sampleImages[randomIndex]);
    }
  }

  private createFileFromLocalPath(imagePath: string): Express.Multer.File {
    // 파일 읽기
    const buffer = fs.readFileSync(imagePath);
    const originalname = path.basename(imagePath);

    // MIME 타입 추론
    const mimetype = this.getMimeType(originalname);

    return {
      fieldname: 'image',
      originalname,
      encoding: '7bit',
      mimetype,
      size: buffer.length,
      buffer,
      stream: Readable.from(buffer),
      destination: '',
      filename: originalname,
      path: '',
    };
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.gif':
        return 'image/gif';
      default:
        return 'application/octet-stream';
    }
  }
}
