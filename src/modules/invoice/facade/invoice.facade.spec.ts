import { Sequelize } from "sequelize-typescript";
import { InvoiceProductModel } from "../repository/product.model";
import { InvoiceModel } from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/facade.factory";
import InvoiceItemModel from "../repository/invoice_item.model";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceProductModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create()

    const input = {
      name: "Invoice 1",
      document: "Invoice 1 document",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "São Paulo",
      state: "SP",
      zipCode: "123.456.789-00",
      items: [{
        id: "Product 1 Id",
        name: "Product 1",
        price: 100
      }]
    };

    const result = await invoiceFacade.generateInvoice(input);

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.total).toBe(input.items.reduce((prev, curr) => curr.price + prev, 0));
  });

  it("should find an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create()

    const invoice = {
      id: "1",
      name: "Invoice 1",
      document: "Invoice 1 document",
      street: "Street 1",
      number: "1",
      complement: "Complement 1",
      city: "São Paulo",
      state: "SP",
      zipCode: "123.456.789-00",
      items: [{
        id: "Product 1 Id",
        name: "Product 1",
        price: 100
      }]
    };
    
    await invoiceFacade.generateInvoice(invoice)

    const input = {
        id: "1"
    }
    const result = await invoiceFacade.findInvoice(input);

    expect(result.id).toBeDefined();
    expect(result.id).toBe(invoice.id)
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.street);
    expect(result.address.number).toBe(invoice.number);
    expect(result.address.complement).toBe(invoice.complement);
    expect(result.address.city).toBe(invoice.city);
    expect(result.address.state).toBe(invoice.state);
    expect(result.address.zipCode).toBe(invoice.zipCode);
    expect(result.items[0].id).toBe(invoice.items[0].id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.total).toBe(invoice.items.reduce((prev, curr) => curr.price + prev, 0));
  });

});