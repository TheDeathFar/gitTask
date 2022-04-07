import {MigrationInterface, QueryRunner} from "typeorm";

export class ConnectItemsAndCategories1628362816719 implements MigrationInterface {
    name = 'ConnectItemsAndCategories1628362816719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `item` ADD `item_category_id` int NOT NULL");
        await queryRunner.query("ALTER TABLE `item` ADD `trade_category_id` int NOT NULL");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_fbc2a600c1a77c97040f613b80b` FOREIGN KEY (`item_category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_3ef66d37520ee07e403bd79923b` FOREIGN KEY (`trade_category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_3ef66d37520ee07e403bd79923b`");
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_fbc2a600c1a77c97040f613b80b`");
        await queryRunner.query("ALTER TABLE `item` DROP COLUMN `trade_category_id`");
        await queryRunner.query("ALTER TABLE `item` DROP COLUMN `item_category_id`");
    }

}
