import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeLoginUniqueInUserTable1627571370415 implements MigrationInterface {
    name = 'MakeLoginUniqueInUserTable1627571370415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` ADD UNIQUE INDEX `IDX_a62473490b3e4578fd683235c5` (`login`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user` DROP INDEX `IDX_a62473490b3e4578fd683235c5`");
    }

}
