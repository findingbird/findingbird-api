import { Module } from '@nestjs/common';

import { BirdModule } from '~/modules/bird/bird.module';
import { ONBOARDING_SERVICE } from '~/modules/onboarding/application/ports/in/onboarding.service.port';
import { OnboardingService } from '~/modules/onboarding/services/onbaording.service';
import { RecordModule } from '~/modules/record/record.module';

@Module({
  imports: [RecordModule, BirdModule],
  controllers: [],
  providers: [
    {
      provide: ONBOARDING_SERVICE,
      useClass: OnboardingService,
    },
  ],
  exports: [ONBOARDING_SERVICE],
})
export class OnboardingModule {}
