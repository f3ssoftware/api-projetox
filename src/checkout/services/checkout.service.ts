import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import * as fs from 'fs';
import { PagarmePaymentMethods } from '../enums/pagarme-payment-methods.enum';
import { CheckoutDto } from '../dtos/checkout.dto';
import { PagarmeOrderDto } from '../dtos/pagarme/pagarme-order.dto';
import { check } from 'prettier';
import { PagarmeCreditOperationTypes } from '../enums/pagarme-credit-operation-types.enum';
import { getCardIssuerName } from '../helpers/card-issuer-name.helper';
import { StoreService } from './store.service';
import { Product } from '../entities/product.inteface';

@Injectable()
export class CheckoutService {
  constructor(private storeService: StoreService) {}
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
        const products = [];

        for (const p of checkoutDto.products) {
          products.push(await this.storeService.getProduct(p));
        }

        const body: PagarmeOrderDto = {
          customer: {
            phones: {
              mobile_phone: {
                area_code: checkoutDto.customer.phone_number.area_code,
                country_code: checkoutDto.customer.phone_number.country_code,
                number: checkoutDto.customer.phone_number.number,
              },
            },
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
          items: await this.fetchItems(products),
          payments: await this.fetchPayments(
            products,
            checkoutDto.payment_method,
          ),
        };
        return await this.createOrder(body);
      }
      case PagarmePaymentMethods.CREDIT_CARD: {
        const products = [];

        for (const p of checkoutDto.products) {
          products.push(await this.storeService.getProduct(p));
        }
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
          items: products.map((product) => {
            return {
              amount: product.amount.toString(),
              quantity: '1',
              description: product.description,
              id: product.id,
              code: product.id,
            };
          }),
          payments: products.map((p) => {
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
      // console.log(body);
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

  private async fetchItems(products: Product[]) {
    return products.map((product) => {
      return {
        amount: product.amount * 100,
        description: product.description,
        id: product.id,
        code: product.id,
        quantity: '1',
      };
    });
  }

  private async fetchPayments(
    products: Product[],
    payment_method: PagarmePaymentMethods,
  ) {
    return products.map((product) => {
      return {
        amount: product.amount * 100,
        payment_method: payment_method,
        pix: {
          expires_in: 1000 * 60 * 15,
        },
      };
    });
  }
}
