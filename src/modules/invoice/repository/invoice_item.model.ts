import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceProductModel } from "./product.model";

@Table({ tableName: "invoice_itens", timestamps: false })
export default class InvoiceItemModel extends Model {
  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  invoiceId: string;

  @BelongsTo(() => InvoiceProductModel)
  product: InvoiceProductModel;

  @ForeignKey(() => InvoiceProductModel)
  @Column({ allowNull: false })
  productId: string;
}