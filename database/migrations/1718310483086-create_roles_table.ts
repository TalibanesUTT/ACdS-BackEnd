import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateRolesTable1718310483086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'Roles',
        columns: [
          new TableColumn({
            name: 'id',
            type: 'int',
            isPrimary: true,
            isNullable: false,
            isGenerated: true,
            generationStrategy: 'increment',
          }),
          new TableColumn({
            name: 'role',
            type: 'varchar',
            length: '15',
            isNullable: false,
            isUnique: true,
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('Roles');
  }
}
