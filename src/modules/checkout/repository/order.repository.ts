import { ClientModel } from "../../client-adm/repository/client.model";
import CatalogProductModel from "../../store-catalog/repository/product.model";
import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderModel } from "./order.model";

export default class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        await OrderModel.create({
          id: order.id.id,
          client: new ClientModel({
            id: order.client.id.id,
            name: order.client.name,
            email: order.client.email,
            document: order.client.document,
            street: order.client.street,
            number: order.client.number,
            complement: order.client.complement,
            city: order.client.city,
            state: order.client.state,
            zipCode: order.client.zipCode,
            createdAt: order.client.createdAt,
            updatedAt: order.client.updatedAt,
            orderId: order.id.id,
          }),
          products: order.products.map((item) => {
            return new CatalogProductModel({
              id: item.id.id,
              name: item.name,
              description: item.description,
              salesPrice: item.salesPrice,
              orderId: order.id.id,
            })
          }),
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        },
        {include: [ClientModel, CatalogProductModel]});
    }
    findOrder(id: string): Promise<Order> {
        throw new Error("Method not implemented.");
    }

}