import { BelongsToMany, Column, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";
import { InvoiceProductModel } from "./product.model";

@Table({
  tableName: "invoices",
  timestamps: false,
})
export class InvoiceModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare document: string;

  @Column({ allowNull: false })
  declare street: string;

  @Column({ allowNull: false })
  declare number: string;

  @Column({ allowNull: false })
  declare complement: string;

  @Column({ allowNull: false })
  declare city: string;

  @Column({ allowNull: false })
  declare state: string;

  @Column({ allowNull: false, field: "zip_code" })
  declare zipCode: string;

  @BelongsToMany(() => InvoiceProductModel, {
    through: { model: () => InvoiceItemModel },
  })
  declare items: InvoiceProductModel[];

  @HasMany(() => InvoiceItemModel)
  declare invoiceProducts: InvoiceItemModel[];

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
