import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateProjects1598611800184 implements MigrationInterface {
    name = 'CreateProjects1598611800184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" character varying NOT NULL, "author_username" character varying(50) NOT NULL, "author_name" character varying(50) NOT NULL, "workspace" character varying(50) NOT NULL, "status" character varying(50) NOT NULL, "author_picture" character varying(50) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
