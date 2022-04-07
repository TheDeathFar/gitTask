import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1627570641357 implements MigrationInterface {
    name = 'CreateUserTable1627570641357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user` (`id` int NOT NULL AUTO_INCREMENT, `login` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `role` enum ('admin', 'user') NOT NULL DEFAULT 'user', PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `user`");
    }

}
