import { MigrationInterface, QueryRunner } from 'typeorm';

export class createChannelsTable1662728669963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE channels (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        owner_id uuid NOT NULL,
        name varchar(64) NOT NULL,
        password varchar(60),
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp,
        deleted_at timestamp
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE channels;
    `);
  }
}
