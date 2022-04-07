import { Controller, Post } from '@nestjs/common';
import { Public } from '#src/modules/auth/decorators/public.decorator';
import { MockService } from '#src/modules/mock/mock.service';

@Controller(`mock`)
export class MockController {
  constructor(private mockService: MockService) {}

  @Public()
  @Post(`generate`)
  async generate() {
    await this.mockService.generate();
  }

  @Public()
  @Post(`generate/items`)
  async generateItems() {
    await this.mockService.generateItems();
  }

  @Public()
  @Post(`generate/tradeoffers`)
  async generateTradeoffers() {
    await this.mockService.generateTradeoffers();
  }
}
