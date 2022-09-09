import { MigrationInterface, QueryRunner } from 'typeorm';

export class createChannelMembersTable1662728679460
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE channel_members (
        user_id uuid NOT NULL,
        channel_id uuid NOT NULL
      );
    `);
    await queryRunner.query(`
        CREATE UNIQUE INDEX user_id_channel_id_index ON channel_members (
          user_id,
          channel_id
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX user_id_channel_id_index;
    `);
    await queryRunner.query(`
      DROP TABLE channel_members;
    `);
  }
}
