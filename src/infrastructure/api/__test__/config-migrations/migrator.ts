import { join } from "path"
import { Sequelize } from "sequelize"
import { SequelizeStorage, Umzug } from "umzug"

export const migrator = (
  sequelize: Sequelize
) => {
  return new Umzug({
    migrations: {
      glob: [
        "*/__test__/migrations/*.{js,ts}",
        {
          cwd: join(__dirname, "../../../"),
          ignore: ["**/*.d.ts", "**/index.ts", "**/index.js"],
        },
      ],
    },
    context: sequelize,
    storage: new SequelizeStorage({ sequelize }),
    logger: console
  })
}