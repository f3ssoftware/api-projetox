import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CheckoutService } from '../services/checkout.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { PagarmePaymentMethods } from '../enums/pagarme-payment-methods.enum';
import { CheckoutDto } from '../dtos/checkout.dto';

@Controller({ version: ['1'], path: 'checkout' })
@ApiTags('Checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('check-payment/:order_id')
  @ApiBearerAuth()
  @ApiParam({ name: 'order_id', type: 'string' })
  public async checkPayment(@Param('order_id') orderId: string) {
    return this.checkoutService.checkPayment(orderId);
  }

  @Post()
  @ApiBearerAuth()
  public async checkout(@Body() checkoutDto: CheckoutDto) {
    return this.checkoutService.checkout(checkoutDto);
  }
}
