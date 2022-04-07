import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePhotoTable1628354632924 implements MigrationInterface {
    name = 'CreatePhotoTable1628354632924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `photo` (`id` int NOT NULL AUTO_INCREMENT, `photo_path` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `photo`");
    }

}
