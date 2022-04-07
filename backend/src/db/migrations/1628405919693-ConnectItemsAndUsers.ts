import {MigrationInterface, QueryRunner} from "typeorm";

export class ConnectItemsAndUsers1628405919693 implements MigrationInterface {
    name = 'ConnectItemsAndUsers1628405919693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `item` ADD `user_id` int NOT NULL");
        await queryRunner.query("ALTER TABLE `item` ADD CONSTRAINT `FK_2f3f2831c9b37214309d23b07fd` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `item` DROP FOREIGN KEY `FK_2f3f2831c9b37214309d23b07fd`");
        await queryRunner.query("ALTER TABLE `item` DROP COLUMN `user_id`");
    }

}
