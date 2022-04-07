import { MigrationInterface, QueryRunner } from 'typeorm';

const categories = [`Одежда`, `Электроника`, `Посуда`, `Еда`, `Мебель`];

export class AddMoreCategories1629032047179 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO category (name)
                             VALUES (?),
                                    (?),
                                    (?),
                                    (?),
                                    (?)`, categories);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE
                             FROM category
                             WHERE name = ?
                                or name = ?
                                or name = ?
                                or name = ?
                                or name = ?`, categories);
  }

}
