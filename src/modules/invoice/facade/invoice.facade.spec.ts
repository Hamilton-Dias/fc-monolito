import { Sequelize } from "sequelize-typescript"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemModel } from "../repository/invoice-item.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"


describe("Invoice Facade test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a invoice", async () => {

    const facade = InvoiceFacadeFactory.create();

    const input = {
        name: "Hamilton",
        document: "1234-5678",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
        items: [{
          id: "1",
          name: "item 1",
          price: 10
        }]
    }

    const result = await facade.generate(input)

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.document).toEqual(input.document)
    expect(result.street).toEqual(input.street)
    expect(result.number).toEqual(input.number)
    expect(result.complement).toEqual(input.complement)
    expect(result.city).toEqual(input.city)
    expect(result.state).toEqual(input.state)
    expect(result.zipCode).toEqual(input.zipCode)
    expect(result.items.length).toEqual(1)
    expect(result.items[0].id).toEqual(input.items[0].id)
    expect(result.items[0].name).toEqual(input.items[0].name)
    expect(result.items[0].price).toEqual(input.items[0].price)
  })

  it("should find a invoice", async () => {

    const facade = InvoiceFacadeFactory.create()

    const input = {
        name: "Hamilton",
        document: "1234-5678",
        street: "Rua 123",
        number: "99",
        complement: "Casa Verde",
        city: "Criciúma",
        state: "SC",
        zipCode: "88888-888",
        items: [{
          id: "1",
          name: "item 1",
          price: 10
        }]
    }

    const generatedInvoice = await facade.generate(input)

    const result = await facade.find({ id: generatedInvoice.id })

    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.name).toBe(input.name)
    expect(result.document).toBe(input.document)
    expect(result.address.street).toBe(input.street)
    expect(result.address.number).toBe(input.number)
    expect(result.address.complement).toBe(input.complement)
    expect(result.address.city).toBe(input.city)
    expect(result.address.state).toBe(input.state)
    expect(result.address.zipCode).toBe(input.zipCode)
    expect(result.items.length).toBe(1)
    expect(result.items[0].id).toBe(input.items[0].id)
    expect(result.items[0].name).toBe(input.items[0].name)
    expect(result.items[0].price).toBe(input.items[0].price)
  })
})