import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../../domain/address.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import FindInvoiceUseCase from "./find.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice 1",
  document: "123",
  address: new Address({
    street: "Street 1",
    number: "1",
    complement: "Complement 1",
    city: "São Paulo",
    state: "São Paulo",
    zipCode: "1234567890",
  }),
  items: [
    new Product({
        id: new Id("1"),
        name: "Product 1",
        price: 10
    }),
    new Product({
        id: new Id("2"),
        name: "Product 2",
        price: 20
    })
  ]
});

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn().mockResolvedValue(invoice)
  };
};

describe("Find Invoice usecase unit test", () => {

  it("should find an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
        id: "1"
    }

    const result = await usecase.execute(input);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);
    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);
    expect(result.items[0].id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id).toBe(invoice.items[1].id.id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);
    expect(result.createdAt).toEqual(invoice.createdAt);
    expect(result.total).toBe(invoice.items.reduce((prev, curr) => curr.price + prev, 0));
  });

});