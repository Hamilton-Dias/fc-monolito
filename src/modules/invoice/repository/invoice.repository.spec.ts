import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceModel } from "./invoice.model"
import { InvoiceItemModel } from "./invoice-item.model"
import Invoice from "../domain/invoice.entity"
import InvoiceItem from "../domain/invoice-item.entity"
import InvoiceRepository from "./invoice.repository"

describe("Invoice Repository test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    await sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a invoice", async () => {

    const item = new InvoiceItem({
        id: new Id("1"),
        name: 'item 1',
        price: 10
    })

    const invoice = new Invoice({
        id: new Id("1"),
        name: "Hamilton",
        document: "1234-5678",
        address: new Address(
            "Rua 123",
            "99",
            "Casa Verde",
            "Criciúma",
            "SC",
            "88888-888"
        ),
        items: [item]
    })

    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" } })
    const invoiceItemDb = await InvoiceItemModel.findAll({ where: { invoiceId: "1" } });

    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toEqual(invoice.id.id)
    expect(invoiceDb.name).toEqual(invoice.name)
    expect(invoiceDb.document).toEqual(invoice.document)
    expect(invoiceDb.street).toEqual(invoice.address.street)
    expect(invoiceDb.number).toEqual(invoice.address.number)
    expect(invoiceDb.complement).toEqual(invoice.address.complement)
    expect(invoiceDb.city).toEqual(invoice.address.city)
    expect(invoiceDb.state).toEqual(invoice.address.state)
    expect(invoiceDb.zipcode).toEqual(invoice.address.zipCode)
    expect(invoiceItemDb).toBeDefined()
    expect(invoiceItemDb.length).toBe(1)
    expect(invoiceItemDb[0].id).toEqual(item.id.id)
    expect(invoiceItemDb[0].name).toEqual(item.name)
    expect(invoiceItemDb[0].price).toEqual(item.price)
  })

  it("should find a invoice", async () => {

    const invoice = await InvoiceModel.create({
      id: '1',
      name: 'Hamilton',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipcode: "88888-888",      
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const invoiceItem = await InvoiceItemModel.create({
      id: '1',
      name: 'Hamilton',
      price: 10,
      invoiceId: '1'
    })

    const repository = new InvoiceRepository()
    const result = await repository.find(invoice.id)

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.street).toEqual(invoice.street)
    expect(result.address.number).toEqual(invoice.number)
    expect(result.address.complement).toEqual(invoice.complement)
    expect(result.address.city).toEqual(invoice.city)
    expect(result.address.state).toEqual(invoice.state)
    expect(result.address.zipCode).toEqual(invoice.zipcode)
    expect(result.items.length).toBe(1)
    expect(result.items[0].id.id).toBe(invoiceItem.id)
    expect(result.items[0].name).toBe(invoiceItem.name)
    expect(result.items[0].price).toBe(invoiceItem.price)
  })
})