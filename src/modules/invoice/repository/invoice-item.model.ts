import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { InvoiceModel } from "./invoice.model";
import { InvoiceProductModel } from "./product.model";

@Table({ tableName: "invoice_itens", timestamps: false })
export default class InvoiceItemModel extends Model {
  @BelongsTo(() => InvoiceModel)
  declare invoice: Awaited<InvoiceModel>;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  declare invoiceId: string;

  @BelongsTo(() => InvoiceProductModel)
  declare product: Awaited<InvoiceProductModel>;

  @ForeignKey(() => InvoiceProductModel)
  @Column({ allowNull: false })
  declare productId: string;
}