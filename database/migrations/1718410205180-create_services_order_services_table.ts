import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateServicesOrderServicesTable1718410205180 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'ServicesOrderServices',
            columns: [
                new TableColumn({
                    name: 'service_order_id',
                    type: 'bigint',
                    isPrimary: true,
                    isNullable: false,
                    unsigned: true,
                }),
                new TableColumn({
                    name: 'service_id',
                    type: 'int',
                    isPrimary: true,
                    isNullable: false,
                    unsigned: true,
                }),
            ]
        }))

        await queryRunner.createForeignKey('ServicesOrderServices', new TableForeignKey({
            name: 'fk_service_order_service_order',
            columnNames: ['service_order_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'ServiceOrders',
        }))

        await queryRunner.createForeignKey('ServicesOrderServices', new TableForeignKey({
            name: 'fk_service_order_service_service',
            columnNames: ['service_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Services',
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('ServicesOrderServices');
    }
}
