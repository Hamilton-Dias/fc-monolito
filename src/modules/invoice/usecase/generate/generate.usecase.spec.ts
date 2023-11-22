import GenerateInvoiceUseCase from "./generate.usecase";

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn()
  };
};

describe("Generate Invoice usecase unit test", () => {

  it("should generate an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

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
    }

    const result = await usecase.execute(input);

    expect(invoiceRepository.save).toHaveBeenCalled();
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

});