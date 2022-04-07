import { UserRole } from '#server/common/enums/user-role.enum';
import { MigrationInterface, QueryRunner } from 'typeorm';

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

export class FillProfileTableWithAdmins1627804575519 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const admins = await getAdmins(queryRunner);

    await queryRunner.query(`INSERT INTO profile (user_id, email, firstName, phone, birthday)
                             VALUES (?, ?, ?, ?, ?)`, [
      admins[0][`id`],
      `admin1@tradeoffer.ru`,
      `Admin 1`,
      `8005553535`,
      `1990-01-01`,
    ]);

    await queryRunner.query(`INSERT INTO profile (user_id, email, firstName, phone, birthday)
                             VALUES (?, ?, ?, ?, ?)`, [
      admins[1][`id`],
      `admin2@tradeoffer.ru`,
      `Admin 2`,
      `8005553535`,
      `1990-01-01`,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const admins = await getAdmins(queryRunner);

    await queryRunner.query(`DELETE
                             FROM profile
                             WHERE user_id = ?
                                OR user_id = ?`, [admins[0][`id`], admins[1][`id`]]);
  }

}
