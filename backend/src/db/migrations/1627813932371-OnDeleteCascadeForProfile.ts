import {MigrationInterface, QueryRunner} from "typeorm";

export class OnDeleteCascadeForProfile1627813932371 implements MigrationInterface {
    name = 'OnDeleteCascadeForProfile1627813932371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `profile` DROP FOREIGN KEY `FK_d752442f45f258a8bdefeebb2f2`");
        await queryRunner.query("ALTER TABLE `profile` ADD CONSTRAINT `FK_d752442f45f258a8bdefeebb2f2` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `profile` DROP FOREIGN KEY `FK_d752442f45f258a8bdefeebb2f2`");
        await queryRunner.query("ALTER TABLE `profile` ADD CONSTRAINT `FK_d752442f45f258a8bdefeebb2f2` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
