import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNameAndAdjustColumnLength1598613279589 implements MigrationInterface {
    name = 'AddNameAndAdjustColumnLength1598613279589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "name" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "workspace"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "workspace" character varying(120) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "status" character varying(20) NOT NULL DEFAULT 'running'`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "author_picture"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "author_picture" character varying(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "author_picture"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "author_picture" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "status" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "workspace"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "workspace" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "name"`);
    }

}
