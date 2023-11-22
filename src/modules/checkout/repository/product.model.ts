import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({ tableName: "products", timestamps: false })
export default class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @Column({ allowNull: false, field: "price" })
  declare salesPrice: number;

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: true })
  declare orderId: string;

  @BelongsTo(() => OrderModel)
  declare order: Awaited<OrderModel>;
}