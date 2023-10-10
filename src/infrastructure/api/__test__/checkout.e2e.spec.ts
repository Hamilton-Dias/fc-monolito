import express, { Express } from 'express';
import { Sequelize } from "sequelize-typescript";
import request from 'supertest';
import { Umzug } from "umzug";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import TransactionModel from '../../../modules/payment/repository/transaction.model';
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import CatalogProductModel from "../../../modules/store-catalog/repository/product.model";
import { checkoutRoute } from "../routes/checkout.route";
import { migrator } from "./config-migrations/migrator";

describe('E2E test for checkout', () => {

	const app: Express = express()
  	app.use(express.json())
  	app.use("/checkout", checkoutRoute)

	let sequelize: Sequelize

	let migration: Umzug<any>;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ":memory:",
			logging: false
		})

		await sequelize.addModels([ProductModel, InvoiceModel, InvoiceItemModel, ClientModel, OrderModel, CatalogProductModel, TransactionModel]);
		migration = migrator(sequelize)
		await migration.up()
	});

	afterEach(async () => {
		if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
	});

	it('should create a checkout', async () => {
		const client = await ClientModel.create({
            id: "1",
            name: "Hamilton",
            email: "x@x.com",
            document: "0000",
            street: "My Street",
            number: "132",
            complement: "aaaaa",
            city: "New York",
            state: "Kingston",
            zipCode: "12401",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

		await ProductModel.create({
			id: "1",
			name: "Product 1",
			description: "Product",
			purchasePrice: 100,
			stock: 100,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await ProductModel.create({
			id: "2",
			name: "Product 2",
			description: "Product 2",
			purchasePrice: 200,
			stock: 200,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		await CatalogProductModel.update({ salesPrice: 100 }, {
			where: {
			  id: "1",
			},
		});

		await CatalogProductModel.update({ salesPrice: 200 }, {
			where: {
			  id: "2",
			},
		});

        const order = await request(app)
            .post("/checkout")
            .send({
                    clientId: "1",
                    products: [
                        {
                            productId: "1",
                        },
                        {
                            productId: "2",
                        },
                    ],
                },
            );

        expect(order.body.clientId).toBe(client.id);
        expect(order.body.products).toStrictEqual([{productId: "1"}, {productId: "2"}]);
	});
});
