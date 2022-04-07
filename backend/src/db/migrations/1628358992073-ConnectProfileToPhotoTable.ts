import {MigrationInterface, QueryRunner} from "typeorm";

export class ConnectProfileToPhotoTable1628358992073 implements MigrationInterface {
    name = 'ConnectProfileToPhotoTable1628358992073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `profile` CHANGE `photo` `photo_id` text NULL");
        await queryRunner.query("ALTER TABLE `profile` DROP COLUMN `photo_id`");
        await queryRunner.query("ALTER TABLE `profile` ADD `photo_id` int NULL");
        await queryRunner.query("ALTER TABLE `profile` ADD CONSTRAINT `FK_74c861d89cc6b7edf34a211064a` FOREIGN KEY (`photo_id`) REFERENCES `photo`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `profile` DROP FOREIGN KEY `FK_74c861d89cc6b7edf34a211064a`");
        await queryRunner.query("ALTER TABLE `profile` DROP COLUMN `photo_id`");
        await queryRunner.query("ALTER TABLE `profile` ADD `photo_id` text NULL");
        await queryRunner.query("ALTER TABLE `profile` CHANGE `photo_id` `photo` text NULL");
    }

}
