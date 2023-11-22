import { Column, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import ClientModel from "./client.model";
import ProductModel from "./product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @HasOne(() => ClientModel)
  declare client: ClientModel;
  
  @HasMany(() => ProductModel)
  declare products: ProductModel[];
  
  @Column({ allowNull: false })
  declare status: string;
  
  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
