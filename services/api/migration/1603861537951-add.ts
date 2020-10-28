import {MigrationInterface, QueryRunner} from "typeorm";

export class add1603861537951 implements MigrationInterface {
    name = 'add1603861537951'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "cpu" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "ram" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "gpu" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "gpu"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "ram"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "cpu"`);
    }

}
