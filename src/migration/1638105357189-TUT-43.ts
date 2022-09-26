import {MigrationInterface, QueryRunner} from "typeorm";

export class TUT431638105357189 implements MigrationInterface {
    name = 'TUT431638105357189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_14d322ba6b6154b944cdcbbed30"`);
        await queryRunner.query(`CREATE TABLE "seasons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_72fcc25659fefafe9afc816844a" UNIQUE ("name"), CONSTRAINT "UQ_0ea6d0d00aa6a3c91a92aecc85c" UNIQUE ("code"), CONSTRAINT "PK_cb8ed53b5fe109dcd4a4449ec9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations_activities" ("locationsId" uuid NOT NULL, "activitiesId" uuid NOT NULL, CONSTRAINT "PK_c1e5b2be94f4278fe7ffc9883e2" PRIMARY KEY ("locationsId", "activitiesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22e1d2a34a0dbe32856f40f4cc" ON "locations_activities" ("locationsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_12473d20f3d94062197cb307b7" ON "locations_activities" ("activitiesId") `);
        await queryRunner.query(`CREATE TABLE "locations_season" ("locationsId" uuid NOT NULL, "seasonsId" uuid NOT NULL, CONSTRAINT "PK_07ec6037bb0a279263bcd17da32" PRIMARY KEY ("locationsId", "seasonsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1571e37aec1ec6f6baf53f4e4b" ON "locations_season" ("locationsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ac6ca49690fcef79603d67b732" ON "locations_season" ("seasonsId") `);
        await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "activityId"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_77d7eff8a7aaa05457a12b8007a" UNIQUE ("code")`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "code" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "UQ_abccbcae051b35786027db70bf1" UNIQUE ("code")`);
        await queryRunner.query(`ALTER TABLE "locations_activities" ADD CONSTRAINT "FK_22e1d2a34a0dbe32856f40f4cc8" FOREIGN KEY ("locationsId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "locations_activities" ADD CONSTRAINT "FK_12473d20f3d94062197cb307b7c" FOREIGN KEY ("activitiesId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locations_season" ADD CONSTRAINT "FK_1571e37aec1ec6f6baf53f4e4be" FOREIGN KEY ("locationsId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "locations_season" ADD CONSTRAINT "FK_ac6ca49690fcef79603d67b7324" FOREIGN KEY ("seasonsId") REFERENCES "seasons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations_season" DROP CONSTRAINT "FK_ac6ca49690fcef79603d67b7324"`);
        await queryRunner.query(`ALTER TABLE "locations_season" DROP CONSTRAINT "FK_1571e37aec1ec6f6baf53f4e4be"`);
        await queryRunner.query(`ALTER TABLE "locations_activities" DROP CONSTRAINT "FK_12473d20f3d94062197cb307b7c"`);
        await queryRunner.query(`ALTER TABLE "locations_activities" DROP CONSTRAINT "FK_22e1d2a34a0dbe32856f40f4cc8"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "UQ_abccbcae051b35786027db70bf1"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_77d7eff8a7aaa05457a12b8007a"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD "activityId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac6ca49690fcef79603d67b732"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1571e37aec1ec6f6baf53f4e4b"`);
        await queryRunner.query(`DROP TABLE "locations_season"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12473d20f3d94062197cb307b7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22e1d2a34a0dbe32856f40f4cc"`);
        await queryRunner.query(`DROP TABLE "locations_activities"`);
        await queryRunner.query(`DROP TABLE "seasons"`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_14d322ba6b6154b944cdcbbed30" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
