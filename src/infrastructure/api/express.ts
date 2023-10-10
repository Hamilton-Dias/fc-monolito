import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { OrderModel } from '../../modules/checkout/repository/order.model';
import { ClientModel } from '../../modules/client-adm/repository/client.model';
import { InvoiceModel } from '../../modules/invoice/repository/invoice.model';
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import TransactionModel from '../../modules/payment/repository/transaction.model';
import { ProductModel } from '../../modules/product-adm/repository/product.model';
import CatalogProductModel from '../../modules/store-catalog/repository/product.model';
import { checkoutRoute } from './routes/checkout.route';
import { clientRoute } from './routes/clients.route';
import { invoiceRoute } from './routes/invoice.route';
import { productRoute } from './routes/product.route';

export const app: Express = express();
app.use(express.json());
app.use("/product", productRoute)
app.use("/client", clientRoute)
app.use("/invoice", invoiceRoute)
app.use("/checkout", checkoutRoute)

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  await sequelize.addModels([ProductModel, InvoiceModel, InvoiceItemModel, ClientModel, OrderModel, CatalogProductModel, TransactionModel]);
  await sequelize.sync();
}
setupDb();