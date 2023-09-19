import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

  async generate(entity: Invoice): Promise<void> {

    await InvoiceModel.create({
      id: entity.id.id,
      name: entity.name,
      document: entity.document,
      street: entity.address.street,
      number: entity.address.number,
      complement: entity.address.complement,
      city: entity.address.city,
      state: entity.address.state,
      zipcode: entity.address.zipCode,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    })

    for (let i = 0; i < entity.items.length; i++) {
        
        const item = entity.items[i]

        await InvoiceItemModel.create({
            id: item.id.id,
            name: item.name,
            price: item.price,
            invoiceId: entity.id.id
        })
    }

  }

  async find(id: string): Promise<Invoice> {

    const invoice = await InvoiceModel.findOne({ where: { id } })

    if (!invoice) {
      throw new Error("Invoice not found")
    }

    const itemsDb = await InvoiceItemModel.findAll({ where: { invoiceId: id } });
    const items = itemsDb.map(item => {
        return new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price
        })
    })

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipcode,
      ),
      items: items,
      createdAt: invoice.createdAt,
      updatedAt: invoice.createdAt
    })

  }
}