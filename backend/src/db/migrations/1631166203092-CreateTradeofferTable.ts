import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTradeofferTable1631166203092 implements MigrationInterface {
    name = 'CreateTradeofferTable1631166203092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `tradeoffer` (`id` int NOT NULL AUTO_INCREMENT, `offered_item_id` int NOT NULL, `desired_item_id` int NOT NULL, UNIQUE INDEX `REL_0b95e3c88d40f9654d2178a600` (`offered_item_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `tradeoffer` ADD CONSTRAINT `FK_0b95e3c88d40f9654d2178a6008` FOREIGN KEY (`offered_item_id`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `tradeoffer` ADD CONSTRAINT `FK_ea29d76bef93510a4ec7d34a811` FOREIGN KEY (`desired_item_id`) REFERENCES `item`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `tradeoffer` DROP FOREIGN KEY `FK_ea29d76bef93510a4ec7d34a811`");
        await queryRunner.query("ALTER TABLE `tradeoffer` DROP FOREIGN KEY `FK_0b95e3c88d40f9654d2178a6008`");
        await queryRunner.query("DROP INDEX `REL_0b95e3c88d40f9654d2178a600` ON `tradeoffer`");
        await queryRunner.query("DROP TABLE `tradeoffer`");
    }
}
