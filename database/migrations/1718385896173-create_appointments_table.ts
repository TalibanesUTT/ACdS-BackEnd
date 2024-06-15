import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class CreateAppointmentsTable1718385896173 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'Appointments',
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
                    name: 'customer_id',
                    type: 'bigint',
                    isNullable: false,
                    unsigned: true,
                }),
                new TableColumn({
                    name: 'date',
                    type: 'date',
                    isNullable: false,
                }),
                new TableColumn({
                    name: 'time',
                    type: 'time',
                    isNullable: false,
                }),
                new TableColumn({
                    name: 'status',
                    type: 'varchar',
                    length: '35',
                    isNullable: false,
                    default: "'Pendiente'"
                }),
                new TableColumn({
                    name: 'reason',
                    type: 'nvarchar',
                    length: '300',
                    isNullable: false,
                }),
                new TableColumn({
                    name: 'create_date',
                    type: 'timestamp',
                    isNullable: false,
                    default: 'now()',
                }),
            ]
        }))

        await queryRunner.createForeignKey('Appointments', new TableForeignKey({
            name: 'fk_appointment_customer',
            columnNames: ['customer_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Users',
        }));

        await queryRunner.createIndex('Appointments', new TableIndex({
            name: 'idx_appointment_date',
            columnNames: ['date'],
        }));

        await queryRunner.createIndex('Appointments', new TableIndex({
            name: 'idx_appointment_status',
            columnNames: ['status'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Appointments');
    }
}
