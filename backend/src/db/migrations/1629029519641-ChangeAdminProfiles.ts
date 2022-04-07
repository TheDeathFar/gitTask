import {MigrationInterface, QueryRunner} from "typeorm";
import { UserRole } from '../../../common/enums/user-role.enum';

interface UserTextRow {
    id: number,
    login: string,
    password: string,
    role: UserRole
}

const getAdmins = async (queryRunner: QueryRunner): Promise<UserTextRow[]> => {
    return await queryRunner.query(`SELECT *
                                  FROM user
                                  WHERE role = ?`, [UserRole.ADMIN]);
};

export class ChangeAdminProfiles1629029519641 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        const admins = await getAdmins(queryRunner);

        await queryRunner.query(`UPDATE profile
                             SET phone = ?
                             WHERE user_id = ? OR user_id = ?`, [
            `9005553535`,
            admins[0][`id`],
            admins[1][`id`],
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const admins = await getAdmins(queryRunner);

        await queryRunner.query(`UPDATE profile
                             SET phone = ?
                             WHERE user_id = ? OR user_id = ?`, [
            `8005553535`,
            admins[0][`id`],
            admins[1][`id`],
        ]);
    }


}
