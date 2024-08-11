import { MigrationInterface, QueryRunner } from "typeorm";
import * as fs from 'fs';
import * as path from 'path';

export class CreateAllStoredProcedures1723372809413 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const sqlFolder = path.join(__dirname, '../stored-procedures');
        const files = fs.readdirSync(sqlFolder);

        for (const file of files) {
            if (file.endsWith('.sql')) {
                const filePath = path.join(sqlFolder, file);
                const sql = fs.readFileSync(filePath, 'utf-8');
                await queryRunner.query(sql);
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP PROCEDURE IF EXISTS GetTotalExpenditure');
        await queryRunner.query('DROP PROCEDURE IF EXISTS GetExpenditureSummary');
        await queryRunner.query('DROP PROCEDURE IF EXISTS GetTotalIncome');
        await queryRunner.query('DROP PROCEDURE IF EXISTS GetIncomeSummary');
        await queryRunner.query('DROP PROCEDURE IF EXISTS GetAccountingBalance');
    }

}
