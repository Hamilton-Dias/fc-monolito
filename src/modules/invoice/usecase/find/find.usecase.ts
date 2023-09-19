import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find.dto";

export default class FindInvoiceUseCase {

  private _invoiceRepository: InvoiceGateway

  constructor(clientRepository: InvoiceGateway) {
    this._invoiceRepository = clientRepository
  }

  async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {

    const result = await this._invoiceRepository.find(input.id)

    const items = result.items.map(item => {
        return {
            id: item.id.id,
            name: item.name,
            price: item.price
        }
    })

    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      address: {
        street: result.address.street,
        number: result.address.number,
        complement: result.address.complement,
        city: result.address.city,
        state: result.address.state,
        zipCode: result.address.zipCode,
      },
      items: items,
      total: result.total,
      createdAt: result.createdAt
    }
  }
}