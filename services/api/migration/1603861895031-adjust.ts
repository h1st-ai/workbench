import {MigrationInterface, QueryRunner} from "typeorm";

export class adjust1603861895031 implements MigrationInterface {
    name = 'adjust1603861895031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "cpu" integer`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "ram" integer`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "gpu" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "gpu"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "ram"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "cpu"`);
    }

}
