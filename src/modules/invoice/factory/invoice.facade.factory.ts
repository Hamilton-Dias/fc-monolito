import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUseCase from "../usecase/find/find.usecase";
import GenerateInvoiceUseCase from "../usecase/generate/generate.usecase";

export default class InvoiceFacadeFactory {
  static create() {
    const invoiceRepository = new InvoiceRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
    const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
    const invoiceFacade = new InvoiceFacade({
      generateUseCase: generateInvoiceUseCase,
      findUseCase: findInvoiceUseCase
    })
    return invoiceFacade
  }
}