import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeDefaultAvatar1598856473513 implements MigrationInterface {
    name = 'ChangeDefaultAvatar1598856473513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "author_picture" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "author_picture" SET DEFAULT 'http://static.h1st.ai/user/default.png'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "author_picture" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "author_picture" SET NOT NULL`);
    }

}
