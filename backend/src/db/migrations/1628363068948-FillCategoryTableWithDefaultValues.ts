import {MigrationInterface, QueryRunner} from "typeorm";

export class FillCategoryTableWithDefaultValues1628363068948 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO category (name) VALUES (?)`, [`Прочее`]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM category WHERE name=?`, [`Прочее`]);
    }

}
