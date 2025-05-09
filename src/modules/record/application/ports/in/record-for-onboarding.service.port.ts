import { CreateRecordForOnboardingDto } from '~/modules/record/application/dtos/create-record-for-onboarding.dto';
import { RecordResultDto } from '~/modules/record/application/dtos/record-result.dto';

export const RECORD_FOR_ONBOARDING_SERVICE = Symbol('IRecordForOnboardingService');
export interface IRecordForOnboardingService {
  createRecordForOnboarding(dto: CreateRecordForOnboardingDto): Promise<RecordResultDto>;
}
