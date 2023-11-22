import express, { Request, Response } from 'express';
import { FindInvoiceFacadeInputDto } from '../../../modules/invoice/facade/invoice.facade.interface';
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.facade.factory';

export const invoiceRoute = express.Router();

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
  const invoiceFacade = InvoiceFacadeFactory.create()
  try {
    const invoiceDto: FindInvoiceFacadeInputDto = {
      id: req.params.id
    };
    const output = await invoiceFacade.findInvoice(invoiceDto);
    res.send(output);
  } catch (err) {
    console.log('aqui')
    console.log({ err })
    res.status(500).send(err);
  }
});