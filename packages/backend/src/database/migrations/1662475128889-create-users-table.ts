import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersTable1662475128889 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        email varchar(256) NOT NULL UNIQUE,
        password varchar(60) NOT NULL,
        name varchar(64) NOT NULL,
        surname varchar(64) NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp,
        deleted_at timestamp
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE users;
    `);
  }
}
