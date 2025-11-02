import { Injectable } from '@nestjs/common';

@Injectable()
export class OnboardingService {
  getSteps(companyId: string) {
    return { 
      message: 'Onboarding steps feature coming soon', 
      companyId,
      steps: [
        { name: 'setup_company', completed: true },
        { name: 'add_first_customer', completed: false },
        { name: 'create_first_item', completed: false },
        { name: 'create_first_invoice', completed: false },
        { name: 'setup_payment_method', completed: false }
      ]
    };
  }

  completeStep(companyId: string, stepName: string) {
    return { message: 'Step completion feature coming soon', companyId, stepName };
  }

  getProgress(companyId: string) {
    return { 
      totalSteps: 5,
      completedSteps: 1,
      progressPercentage: 20,
      nextStep: 'add_first_customer',
      companyId
    };
  }

  initializeSteps(companyId: string) {
    return { message: 'Step initialization feature coming soon', companyId };
  }
}