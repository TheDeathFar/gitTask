import {MigrationInterface, QueryRunner} from "typeorm";

export class SetOnDeleteScenariosForProfile1628599585857 implements MigrationInterface {
    name = 'SetOnDeleteScenariosForProfile1628599585857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `profile` DROP FOREIGN KEY `FK_74c861d89cc6b7edf34a211064a`");
        await queryRunner.query("ALTER TABLE `profile` ADD CONSTRAINT `FK_74c861d89cc6b7edf34a211064a` FOREIGN KEY (`photo_id`) REFERENCES `photo`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `profile` DROP FOREIGN KEY `FK_74c861d89cc6b7edf34a211064a`");
        await queryRunner.query("ALTER TABLE `profile` ADD CONSTRAINT `FK_74c861d89cc6b7edf34a211064a` FOREIGN KEY (`photo_id`) REFERENCES `photo`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
