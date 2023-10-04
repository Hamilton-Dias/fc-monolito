import { Column, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import CatalogProductModel from "../../store-catalog/repository/product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @HasOne(() => ClientModel)
  client: ClientModel;
  
  @HasMany(() => CatalogProductModel)
  products: CatalogProductModel[];
  
  @Column({ allowNull: false })
  status: string;
  
  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
