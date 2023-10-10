import request from 'supertest';
import { app, sequelize } from '../express';
import { ProductModel } from '../../../modules/product-adm/repository/product.model';
import { migrator } from './config-migrations/migrator';
import { Sequelize } from "sequelize-typescript";
import { Umzug } from 'umzug';

describe('E2E test for product', () => {
	let sequelize: Sequelize

	let migration: Umzug<any>;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ":memory:",
			logging: false
		})

		await sequelize.addModels([ProductModel]);
		migration = migrator(sequelize)
		await migration.up()
	});

	afterAll(async () => {
		await sequelize.close();
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
