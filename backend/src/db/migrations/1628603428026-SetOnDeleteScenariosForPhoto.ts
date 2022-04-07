import {MigrationInterface, QueryRunner} from "typeorm";

export class SetOnDeleteScenariosForPhoto1628603428026 implements MigrationInterface {
    name = 'SetOnDeleteScenariosForPhoto1628603428026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `items_to_photos` DROP FOREIGN KEY `FK_b0e731fd58e19cf8b1b7aba4098`");
        await queryRunner.query("ALTER TABLE `items_to_photos` ADD CONSTRAINT `FK_b0e731fd58e19cf8b1b7aba4098` FOREIGN KEY (`photo_id`) REFERENCES `photo`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `items_to_photos` DROP FOREIGN KEY `FK_b0e731fd58e19cf8b1b7aba4098`");
        await queryRunner.query("ALTER TABLE `items_to_photos` ADD CONSTRAINT `FK_b0e731fd58e19cf8b1b7aba4098` FOREIGN KEY (`photo_id`) REFERENCES `photo`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
