import { MigrationInterface, QueryRunner, Table, TableColumn, TableIndex, TableUnique } from "typeorm";

export class CreateExpendituresTable1723188910785 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "Expenditures",
                columns: [
                    new TableColumn({
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: true,
                        generationStrategy: "increment",
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "data",
                        type: "json",
                        isNullable: false,
                    }),
                    new TableColumn({
                        name: "month",
                        type: "smallint",
                        isNullable: false,
                        unsigned: true,
                    }),
                    new TableColumn({
                        name: "year",
                        type: "smallint",
                        isNullable: false,
                        unsigned: true,
                    }),
                ]
            })
        );

        await queryRunner.createIndex("Expenditures", new TableIndex({
            name: "idx_expenditure_month_year",
            columnNames: ["month", "year"],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("Expenditures");
    }
}
