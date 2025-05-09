import { OnboardingDto } from '~/modules/onboarding/application/dtos/onboarding.dto';

export const ONBOARDING_SERVICE = Symbol('IOnboardingService');

export interface IOnboardingService {
  onboarding(dto: OnboardingDto): Promise<void>;
}
