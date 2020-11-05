import { join } from 'path'
import { ConnectionOptions } from 'typeorm'

import { Area } from './modules/areas/area.entity'
import { Category } from './modules/categories/category.entity'
import { Item } from './modules/items/item.entity'

const PROD_ENV = 'production'

const config = {
  host: 'localhost',
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
}

// FOR GOOGLE CLOUD SQL
if (
  process.env.INSTANCE_CONNECTION_NAME &&
  process.env.NODE_ENV === PROD_ENV
) {
  config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
}

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: config.host,
  port: 5432,
  username: config.user || 'postgres',
  password: config.password || '123456789',
  database: config.database || 'thuedo-dev',
  entities: [
    Area,
    Category,
    Item
  ],
  // We are using migrations, synchronize should be set to false.
  synchronize: true,
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: ['warn', 'error'],
  logger: process.env.NODE_ENV === PROD_ENV ? 'file' : 'debug',
  migrations: [
    join(__dirname, 'migrations/*{.ts,.js}')
  ],
  migrationsTableName: 'migrations_typeorm',
  cli: {
    migrationsDir: 'src/migrations'
  }
}

export = connectionOptions