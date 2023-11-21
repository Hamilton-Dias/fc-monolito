import request from 'supertest';
import express, { Express } from 'express';
import { Sequelize } from "sequelize-typescript";
import { productRoute } from '../routes/product.route';
import { Umzug } from "umzug";
import { migrator } from "./config-migrations/migrator";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceProductModel } from "../../../modules/invoice/repository/product.model";
import TransactionModel from '../../../modules/payment/repository/transaction.model';
import ProductModel from "../../../modules/product-adm/repository/product.model";
import CatalogProductModel from "../../../modules/store-catalog/repository/product.model";
import InvoiceItemModel from '../../../modules/invoice/repository/invoice_item.model';

describe('E2E test for product', () => {
	const app: Express = express()
  	app.use(express.json())
	  app.use("/product", productRoute)

	let sequelize: Sequelize

	let migration: Umzug<any>;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ":memory:",
			logging: false
		})

		await sequelize.addModels([ProductModel, InvoiceModel, InvoiceProductModel, ClientModel, OrderModel, CatalogProductModel, TransactionModel, InvoiceItemModel]);
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

	it('should create a product', async () => {
		const response = await request(app)
			.post('/product')
			.send({
				name: 'Product A',
				description: 'Product A Description',
				purchasePrice: 10,
				stock: 100,
			});

		expect(response.status).toBe(200);
		expect(response.body.id).toBeDefined();
		expect(response.body.name).toBe('Product A');
		expect(response.body.description).toBe('Product A Description');
		expect(response.body.purchasePrice).toBe(10);
		expect(response.body.stock).toBe(100);
	});
});
