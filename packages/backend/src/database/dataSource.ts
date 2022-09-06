import 'dotenv/config';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres' as const,
  host: process.env['DB_HOST'] as string,
  port: Number(process.env['DB_PORT']) as number,
  username: process.env['DB_USER'] as string,
  password: process.env['DB_PASS'] as string,
  database: process.env['DB_NAME'] as string,
  entities: [`${__dirname}/../**/entities/*.{js,ts}`],
  migrations: [`${__dirname}/migrations/*.{js,ts}`],
});
