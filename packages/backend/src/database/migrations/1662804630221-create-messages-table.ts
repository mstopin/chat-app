import { MigrationInterface, QueryRunner } from 'typeorm';

export class createMessagesTable1662804630221 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE messages (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        content varchar(2048) NOT NULL,
        user_id uuid NOT NULL,
        channel_id uuid NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await queryRunner.query(`
      CREATE INDEX channel_id_index ON messages (channel_id);
    `);
    await queryRunner.query(`
      CREATE INDEX created_at_index ON messages (created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX created_at_index');
    await queryRunner.query('DROP INDEX channel_id_index');
    await queryRunner.query('DROP TABLE messages');
  }
}
