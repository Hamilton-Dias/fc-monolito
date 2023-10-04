import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import { OrderModel } from "./order.model";
import { ClientModel } from "../../client-adm/repository/client.model";
import OrderRepository from "./order.repository";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import Client from "../../client-adm/domain/client.entity";
import CatalogProductModel from "../../store-catalog/repository/product.model";

describe("OrderRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([OrderModel, CatalogProductModel, ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an order", async () => {
    const order = new Order({
      id: new Id("Order id 1"),
      client: new Client({
        id: new Id("Client id 1"),
        name: "Client name",
        email: "client@email.com",
        document: "123",
        street: "Client street",
        number: "Client number",
        complement: "Client complement",
        city: "Client city",
        state: "Client state",
        zipCode: "Client zipCode",
      }),
      products: [
        new Product({
            id: new Id("Product id 1"),
            name: "Produt name",
            description: "Product description",
            salesPrice: 10,
        })
      ],
      status: "status",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const repository = new OrderRepository();
    await repository.addOrder(order);

    const orderDb = await OrderModel.findOne({ 
        where: { id: "Order id 1" },
        include: [
            { model: ClientModel },
            { model: CatalogProductModel }
        ]
    });

    expect(orderDb).toBeDefined();
    expect(orderDb.id).toBe(order.id.id);
    expect(orderDb.client.id).toEqual(order.client.id.id);
    expect(orderDb.client.name).toEqual(order.client.name);
    expect(orderDb.client.email).toEqual(order.client.email);
    expect(orderDb.client.document).toEqual(order.client.document);
    expect(orderDb.client.street).toEqual(order.client.street);
    expect(orderDb.client.number).toEqual(order.client.number);
    expect(orderDb.client.complement).toEqual(order.client.complement);
    expect(orderDb.client.city).toEqual(order.client.city);
    expect(orderDb.client.state).toEqual(order.client.state);
    expect(orderDb.client.zipCode).toEqual(order.client.zipCode);
    expect(orderDb.products[0].id).toEqual(order.products[0].id.id);
    expect(orderDb.products[0].name).toBe(order.products[0].name);
    expect(orderDb.products[0].description).toBe(order.products[0].description);
    expect(orderDb.products[0].salesPrice).toBe(order.products[0].salesPrice);
    expect(orderDb.status).toEqual(order.status);
  });

});