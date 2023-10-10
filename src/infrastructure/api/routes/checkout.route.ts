import express, { Request, Response } from 'express';
import OrderRepository from '../../../modules/checkout/repository/order.repository';
import { PlaceOrderInputDto } from '../../../modules/checkout/usecase/place-order/place-order.dto';
import PlaceOrderUseCase from '../../../modules/checkout/usecase/place-order/place-order.usecase';
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory';
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.facade.factory';
import PaymentFacadeFactory from '../../../modules/payment/factory/payment.facade.factory';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';
import StoreCatalogFacadeFactory from '../../../modules/store-catalog/factory/facade.factory';

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create();
  const productFacade = ProductAdmFacadeFactory.create();
  const catalogFacade = StoreCatalogFacadeFactory.create();
  const orderRepository = new OrderRepository();
  const invoiceFacade = InvoiceFacadeFactory.create();
  const paymentFacade = PaymentFacadeFactory.create();

  const placeOrderUseCase = new PlaceOrderUseCase(clientFacade, productFacade, catalogFacade, orderRepository, invoiceFacade, paymentFacade)
  try {
    const placeOrderInputDto: PlaceOrderInputDto = {
      clientId: req.body.clientId,
      products: req.body.products,
    };
    const output = await placeOrderUseCase.execute(placeOrderInputDto);
    res.send(output);
  } catch (err) {
    console.error({ err })
    res.status(500).send(err);
  }
});