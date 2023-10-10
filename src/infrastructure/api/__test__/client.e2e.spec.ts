import request from 'supertest';
import { app, sequelize } from '../express';

describe('E2E test for client', () => {
	beforeEach(async () => {
		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
	});

	it('should create a client', async () => {
		const response = await request(app)
			.post('/client')
			.send({
				name: 'Client 1',
				email: 'client@email.com',
				document: "123",
				street: "street 1",
				number: "1",
				complement: "",
				city: "São Paulo",
				state: "SP",
				zipCode: "1234567890",
			});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({});
	});
});
