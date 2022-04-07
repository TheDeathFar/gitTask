import {MigrationInterface, QueryRunner} from "typeorm";

export class SetOnDeleteScenariosForItem1628604581465 implements MigrationInterface {
    name = 'SetOnDeleteScenariosForItem1628604581465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_2f3f2831c9b37214309d23b07fd`");
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_3ef66d37520ee07e403bd79923b`");
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_fbc2a600c1a77c97040f613b80b`");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_fbc2a600c1a77c97040f613b80b` FOREIGN KEY (`item_category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_3ef66d37520ee07e403bd79923b` FOREIGN KEY (`trade_category_id`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_2f3f2831c9b37214309d23b07fd` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_2f3f2831c9b37214309d23b07fd`");
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_3ef66d37520ee07e403bd79923b`");
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_fbc2a600c1a77c97040f613b80b`");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_fbc2a600c1a77c97040f613b80b` FOREIGN KEY (`item_category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_3ef66d37520ee07e403bd79923b` FOREIGN KEY (`trade_category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_2f3f2831c9b37214309d23b07fd` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
