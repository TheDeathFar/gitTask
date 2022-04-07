import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateItemsTable1628362090635 implements MigrationInterface {
    name = 'CreateItemsTable1628362090635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `item` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` text NOT NULL, `geo` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `items_to_photos` (`item_id` int NOT NULL, `photo_id` int NOT NULL, INDEX `IDX_b3eb27f1bbc387b4c50ca06bb7` (`item_id`), INDEX `IDX_b0e731fd58e19cf8b1b7aba409` (`photo_id`), PRIMARY KEY (`item_id`, `photo_id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `items_to_photos` ADD CONSTRAINT `FK_b3eb27f1bbc387b4c50ca06bb7a` FOREIGN KEY (`item_id`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
        await queryRunner.query("ALTER TABLE `items_to_photos` ADD CONSTRAINT `FK_b0e731fd58e19cf8b1b7aba4098` FOREIGN KEY (`photo_id`) REFERENCES `photo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `items_to_photos` DROP FOREIGN KEY `FK_b0e731fd58e19cf8b1b7aba4098`");
        await queryRunner.query("ALTER TABLE `items_to_photos` DROP FOREIGN KEY `FK_b3eb27f1bbc387b4c50ca06bb7a`");
        await queryRunner.query("DROP INDEX `IDX_b0e731fd58e19cf8b1b7aba409` ON `items_to_photos`");
        await queryRunner.query("DROP INDEX `IDX_b3eb27f1bbc387b4c50ca06bb7` ON `items_to_photos`");
        await queryRunner.query("DROP TABLE `items_to_photos`");
        await queryRunner.query("DROP TABLE `item`");
    }

}
