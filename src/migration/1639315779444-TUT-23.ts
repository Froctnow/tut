import {MigrationInterface, QueryRunner} from "typeorm";

export class TUT231639315779444 implements MigrationInterface {
    name = 'TUT231639315779444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "x"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "y"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "point" geometry(Point) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "point"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "y" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "x" double precision NOT NULL`);
    }

}
