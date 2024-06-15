import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex } from "typeorm";

export class CreateServicesTable1718381809400 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'Services',
            columns: [
                new TableColumn({
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true,
                }),
                new TableColumn({
                    name: 'service',
                    type: 'varchar',
                    length: '30',
                    isNullable: false,
                    isUnique: true,
                }),
            ]
        }))

        await queryRunner.createIndex('Services', new TableIndex({
            name: 'idx_service_service',
            columnNames: ['service'],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Services');
    }

}
