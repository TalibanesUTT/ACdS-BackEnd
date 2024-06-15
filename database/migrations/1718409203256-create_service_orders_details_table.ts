import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class CreateServiceOrdersDetailsTable1718409203256 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'ServiceOrdersDetails',
            columns: [
                new TableColumn({
                    name: 'id',
                    type: 'bigint',
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true,
                }),
                new TableColumn({
                    name: 'service_order_id',
                    type: 'bigint',
                    isNullable: false,
                    unsigned: true,
                }),
                new TableColumn({
                    name: 'budget',
                    type: 'decimal',
                    isNullable: true,
                    precision: 10,
                    scale: 2,
                }),
                new TableColumn({
                    name: 'total_cost',
                    type: 'decimal',
                    isNullable: true,
                    precision: 10,
                    scale: 2,
                }),
                new TableColumn({
                    name: 'departure_date',
                    type: 'timestamp',
                    isNullable: true,
                }),
                new TableColumn({
                    name: 'repair_days',
                    type: 'smallint',
                    isNullable: true,
                    unsigned: true,
                }),
                new TableColumn({
                    name: 'final_mileage',
                    type: 'int',
                    isNullable: true,
                    unsigned: true,
                }),
                new TableColumn({
                    name: 'observations',
                    type: 'text',
                    isNullable: true,
                }),
            ]
        }))

        await queryRunner.createForeignKey('ServiceOrdersDetails', new TableForeignKey({
            name: 'fk_service_order_details_service_order',
            columnNames: ['service_order_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'ServiceOrders',
        }))

        await queryRunner.createIndex('ServiceOrdersDetails', new TableIndex({
            name: 'idx_service_order_details_departure_date',
            columnNames: ['departure_date'],
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('ServiceOrdersDetails');
    }
}
