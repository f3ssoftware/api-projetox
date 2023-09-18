import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as fs from 'fs';
import { PagarmePaymentMethods } from '../enums/pagarme-payment-methods.enum';
import { CheckoutDto } from '../dtos/checkout.dto';
import { PagarmeOrderDto } from '../dtos/pagarme/pagarme-order.dto';
import { check } from 'prettier';
import { PagarmeCreditOperationTypes } from '../enums/pagarme-credit-operation-types.enum';
import { getCardIssuerName } from '../helpers/card-issuer-name.helper';

@Injectable()
export class CheckoutService {
  public async checkPayment(orderId: string) {
    try {
      const req = await axios.get(
        `${process.env.PAGARME_API_URL}/core/v5/orders/${orderId}`,
        {
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(`${process.env.PAGARME_SECRET_KEY}:`).toString(
                'base64',
              ),
          },
        },
      );

      return req.data;
    } catch (err) {
      console.error(err);
      return err.data;
      // throw new Error(err);
    }
  }

  public async checkout(checkoutDto: CheckoutDto) {
    switch (checkoutDto.payment_method) {
      case PagarmePaymentMethods.PIX: {
        const body: PagarmeOrderDto = {
          customer: {
            phones: {
              mobile_phone: {
                area_code: checkoutDto.customer.phone_number.area_code,
                country_code: checkoutDto.customer.phone_number.country_code,
                number: checkoutDto.customer.phone_number.number,
              },
            },
            // address: {
            //   city: checkoutDto.customer.address.city,
            //   country: checkoutDto.customer.address.country,
            //   state: checkoutDto.customer.address.state,
            //   zip_code: checkoutDto.customer.address.zipcode,
            // },
            name: checkoutDto.customer.name,
            birthdate: checkoutDto.customer.birthDate,
            document: checkoutDto.customer.document,
            email: checkoutDto.customer.email,
            gender: checkoutDto.customer.gender,
            document_type: checkoutDto.customer.document_type,
            type: checkoutDto.customer.type,
            code: '',
          },
          anti_fraud_enabled: true,
          closed: false,
          items: checkoutDto.products.map((product) => {
            return {
              amount: product.amount.toString(),
              description: product.description,
              id: product.id,
              code: product.id,
              quantity: '1',
            };
          }),
          payments: checkoutDto.products.map((p) => {
            return {
              amount: p.amount,
              payment_method: checkoutDto.payment_method,
              pix: {
                expires_in: 1000 * 60 * 15,
              },
            };
          }),
        };
        return await this.createOrder(body);
      }
      case PagarmePaymentMethods.CREDIT_CARD: {
        const body: PagarmeOrderDto = {
          customer: {
            phones: {
              mobile_phone: {
                area_code: checkoutDto.customer.phone_number.area_code,
                country_code: checkoutDto.customer.phone_number.country_code,
                number: checkoutDto.customer.phone_number.number,
              },
            },
            // address: {
            //   city: checkoutDto.customer.address.city,
            //   country: checkoutDto.customer.address.country,
            //   state: checkoutDto.customer.address.state,
            //   zip_code: checkoutDto.customer.address.zipcode,
            // },
            name: checkoutDto.customer.name,
            birthdate: checkoutDto.customer.birthDate,
            document: checkoutDto.customer.document,
            email: checkoutDto.customer.email,
            gender: checkoutDto.customer.gender,
            document_type: checkoutDto.customer.document_type,
            type: checkoutDto.customer.type,
            code: '',
          },
          anti_fraud_enabled: true,
          closed: false,
          items: checkoutDto.products.map((product) => {
            return {
              amount: product.amount.toString(),
              quantity: '1',
              description: product.description,
              id: product.id,
              code: product.id,
            };
          }),
          payments: checkoutDto.products.map((p) => {
            return {
              amount: p.amount,
              payment_method: checkoutDto.payment_method,
              credit_card: {
                operation_type: PagarmeCreditOperationTypes.AUTH_AND_CAPTURE,
                installments: checkoutDto.card.installments,
                card: {
                  billing_address: {
                    city: checkoutDto.customer.address.city,
                    country: Number(checkoutDto.customer.address.country),
                    state: checkoutDto.customer.address.state,
                    zip_code: checkoutDto.customer.address.zipcode,
                    line_1: checkoutDto.customer.address.address,
                  },
                  brand: getCardIssuerName(checkoutDto.card.card_number),
                  cvv: checkoutDto.card.cvv,
                  exp_month: Number(checkoutDto.card.exp_month),
                  exp_year: Number(checkoutDto.card.exp_year),
                  holder_name: checkoutDto.card.card_name,
                  holder_document: checkoutDto.customer.document,
                  number: checkoutDto.card.card_number,
                },
                statement_descriptor: 'PJX FINANCEIR',
              },
            };
          }),
        };
        return await this.createOrder(body);
      }
    }
  }

  private async createOrder(body: PagarmeOrderDto) {
    try {
      // return body;
      const req = await axios.post(
        `${process.env.PAGARME_API_URL}/core/v5/orders`,
        body,
        {
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(`${process.env.PAGARME_SECRET_KEY}:`).toString(
                'base64',
              ),
          },
        },
      );

      return req.data;
    } catch (err) {
      console.error(err.response.data);
      throw new UnprocessableEntityException(err.response.data);
    }
  }
}
