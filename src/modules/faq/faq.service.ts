import { Injectable } from '@nestjs/common';

@Injectable()
export class FaqService {
  getCategories() {
    return { message: 'FAQ categories feature coming soon' };
  }

  getFaqsByCategory(categoryId: string) {
    return { message: 'FAQ by category feature coming soon', categoryId };
  }

  createCategory(body: any) {
    return { message: 'FAQ category creation feature coming soon', body };
  }

  createFaq(body: any) {
    return { message: 'FAQ creation feature coming soon', body };
  }
}