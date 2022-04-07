import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCategoryTable1628362247729 implements MigrationInterface {
    name = 'CreateCategoryTable1628362247729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `category` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `category`");
    }

}
