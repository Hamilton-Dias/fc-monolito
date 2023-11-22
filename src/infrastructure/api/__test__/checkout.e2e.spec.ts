import { app } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "../../../modules/checkout/repository/order.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceProductModel } from "../../../modules/invoice/repository/product.model";
import TransactionModel from '../../../modules/payment/repository/transaction.model';
import ProductModel from "../../../modules/product-adm/repository/product.model";
import CatalogProductModel from "../../../modules/store-catalog/repository/product.model";
import InvoiceItemModel from '../../../modules/invoice/repository/invoice-item.model';
import Id from '../../../modules/@shared/domain/value-object/id.value-object';

describe('E2E test for checkout', () => {

	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: "sqlite",
			storage: ":memory:",
			logging: false,
			sync: { force: true },
		});

		sequelize.addModels([ProductModel, InvoiceModel, InvoiceProductModel, ClientModel, OrderModel, CatalogProductModel, TransactionModel, InvoiceItemModel]);

		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it('should create a checkout', async () => {
		const invoiceId = new Id()

		jest.mock('../../../modules/product-adm/usecase/check-stock/check-stock.usecase', () => ({
			__esModule: true,
			...jest.requireActual('../../../modules/product-adm/usecase/check-stock/check-stock.usecase'),
			execute: jest.fn(({ productId }: { productId: string }) => 
				Promise.resolve({
					productId,
					stock: 10,
				})
			),
		}));

		jest.mock('../../../modules/invoice/usecase/generate/generate.usecase', () => ({
			__esModule: true,
			...jest.requireActual('../../../modules/invoice/usecase/generate/generate.usecase'),
			execute: jest.fn((invoice) => Promise.resolve({ id: invoiceId })),
		}));

		jest.mock('../../../modules/checkout/repository/order.repository', () => ({
			__esModule: true,
			...jest.requireActual('../../../modules/checkout/repository/order.repository'),
			addOrder: jest.fn((order) => Promise.resolve({
				id: new Id(),
				status: "approved",
				total: 100,
				products: [{
				productId: new Id(),
				}]
			})),
		}));

		await ClientModel.create({
			id: "1",
			name: "test",
			email: "test@test.com",
			document: "test",
			street: "16 avenue",
			number: "123",
			complement: "Ap 400",
			city: "My city",
			state: "State",
			zipCode: "89777310",
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		await CatalogProductModel.create({
			id: "1",
			name: "test",
			description: "test",
			salesPrice: 100,
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		const response = await request(app)
		.post("/checkout")
		.send({
			clientId: "1",
			products: [{ productId: "1" }],
		});

		expect(response.status).toBe(200);
		expect(response.body.id).toBeDefined()
		expect(response.body.invoiceId).toBeDefined()
		expect(response.body.status).toBe("approved")
		expect(response.body.total).toBe(100)
		expect(response.body.products.length).toBe(1)
	});
});
