import { ClientModel } from "../../client-adm/repository/client.model";
import CatalogProductModel from "../../store-catalog/repository/product.model";
import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderModel } from "./order.model";

export default class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        const client = {
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
            updatedAt: order.client.updatedAt
        }
        const products = order.products.map((p) => ({
            id: p.id.id,
            name: p.name,
            description: p.description,
            salesPrice: p.salesPrice,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
        }))
        await OrderModel.create({
            id: order.id.id,
            client,
            products,
            status: order.status,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
        include: [
            { model: ClientModel },
            { model: CatalogProductModel }
        ],
        })
    }
    findOrder(id: string): Promise<Order> {
        throw new Error("Method not implemented.");
    }

}