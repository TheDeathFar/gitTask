import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeFirstNameNaming1631166434909 implements MigrationInterface {
    name = 'ChangeFirstNameNaming1631166434909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `profile` CHANGE `firstName` `first_name` varchar(255) NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `profile` CHANGE `first_name` `firstName` varchar(255) NOT NULL");
    }

}
