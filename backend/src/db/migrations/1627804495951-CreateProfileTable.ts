import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateProfileTable1627804495951 implements MigrationInterface {
    name = 'CreateProfileTable1627804495951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `profile` (`user_id` int NOT NULL, `email` varchar(255) NOT NULL, `firstName` varchar(255) NOT NULL, `phone` varchar(10) NOT NULL, `birthday` date NOT NULL, `photo` text NULL, UNIQUE INDEX `IDX_3825121222d5c17741373d8ad1` (`email`), UNIQUE INDEX `REL_d752442f45f258a8bdefeebb2f` (`user_id`), PRIMARY KEY (`user_id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `profile` ADD CONSTRAINT `FK_d752442f45f258a8bdefeebb2f2` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `profile` DROP FOREIGN KEY `FK_d752442f45f258a8bdefeebb2f2`");
        await queryRunner.query("DROP INDEX `REL_d752442f45f258a8bdefeebb2f` ON `profile`");
        await queryRunner.query("DROP INDEX `IDX_3825121222d5c17741373d8ad1` ON `profile`");
        await queryRunner.query("DROP TABLE `profile`");
    }

}
