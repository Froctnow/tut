import {MigrationInterface, QueryRunner} from "typeorm";

export class InitDB1634566027343 implements MigrationInterface {
    name = 'InitDB1634566027343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hashtags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_994c5bf9151587560db430018c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images_locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "locationId" uuid, CONSTRAINT "PK_5b76d09cdccfd1a1b46b52a7d88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images_reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "reviewId" uuid, CONSTRAINT "PK_88dddc9029f0ea09360d6ff8acd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location_moderations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "locationId" uuid, "reviewerId" uuid, CONSTRAINT "REL_206a00827ea3483d9d11afd47c" UNIQUE ("locationId"), CONSTRAINT "PK_bbf1cf11234a97cd34f571d2499" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "firstName" character varying NOT NULL, "externalId" character varying NOT NULL, "lastName" character varying NOT NULL, "displayName" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_041f7aa05fedc841383a372e429" UNIQUE ("externalId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "estimations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sign" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "reviewId" uuid, "userId" uuid, CONSTRAINT "PK_c7ec983ab9a4dccf21b74198cd6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "rating" numeric NOT NULL, "recommendation" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userId" uuid, "locationId" uuid, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_16c8f0c1ac45b0ce3f403a53b05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "imageId" uuid, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "REL_fcb2e05575ea73809a8ff82fa1" UNIQUE ("imageId"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "x" double precision NOT NULL, "y" double precision NOT NULL, "rating" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "categoryId" uuid, "activityId" uuid, "userId" uuid, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a4a20faec66bec382b6244f9ac4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "imageId" uuid, CONSTRAINT "UQ_a7455bc944cd82d40cc41e83c46" UNIQUE ("name"), CONSTRAINT "REL_f978b5e42cd5ac8b4033f0ff64" UNIQUE ("imageId"), CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations_hashtags_hashtags" ("locationsId" uuid NOT NULL, "hashtagsId" uuid NOT NULL, CONSTRAINT "PK_2d20e0b4ec17bcbc019e4eac53b" PRIMARY KEY ("locationsId", "hashtagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f4fc86b14ab3e056e779069283" ON "locations_hashtags_hashtags" ("locationsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a35cf4f476556a3259355c1b33" ON "locations_hashtags_hashtags" ("hashtagsId") `);
        await queryRunner.query(`ALTER TABLE "images_locations" ADD CONSTRAINT "FK_6bb7e23db4d1689f5bfa8ba44e1" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "images_reviews" ADD CONSTRAINT "FK_d1c9500b68ca7723d3850ecc04f" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "location_moderations" ADD CONSTRAINT "FK_206a00827ea3483d9d11afd47cf" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location_moderations" ADD CONSTRAINT "FK_f05df900c0d81a962e3adf04a0f" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "FK_c8db5603420d119933bbc5c398c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estimations" ADD CONSTRAINT "FK_0a83b549c07c2a4088836527ad2" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "estimations" ADD CONSTRAINT "FK_46ccc538648337542c403c6ebbb" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_4d7dd9fcc84b64206c7f58dde7e" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_fcb2e05575ea73809a8ff82fa1d" FOREIGN KEY ("imageId") REFERENCES "images_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_b2ce2066715e773496988a9e109" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_14d322ba6b6154b944cdcbbed30" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_78eda52dc27b7ad20350c4a752d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_f978b5e42cd5ac8b4033f0ff640" FOREIGN KEY ("imageId") REFERENCES "images_activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "locations_hashtags_hashtags" ADD CONSTRAINT "FK_f4fc86b14ab3e056e7790692836" FOREIGN KEY ("locationsId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "locations_hashtags_hashtags" ADD CONSTRAINT "FK_a35cf4f476556a3259355c1b33a" FOREIGN KEY ("hashtagsId") REFERENCES "hashtags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "locations_hashtags_hashtags" DROP CONSTRAINT "FK_a35cf4f476556a3259355c1b33a"`);
        await queryRunner.query(`ALTER TABLE "locations_hashtags_hashtags" DROP CONSTRAINT "FK_f4fc86b14ab3e056e7790692836"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_f978b5e42cd5ac8b4033f0ff640"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_78eda52dc27b7ad20350c4a752d"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_14d322ba6b6154b944cdcbbed30"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_b2ce2066715e773496988a9e109"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_fcb2e05575ea73809a8ff82fa1d"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_4d7dd9fcc84b64206c7f58dde7e"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f"`);
        await queryRunner.query(`ALTER TABLE "estimations" DROP CONSTRAINT "FK_46ccc538648337542c403c6ebbb"`);
        await queryRunner.query(`ALTER TABLE "estimations" DROP CONSTRAINT "FK_0a83b549c07c2a4088836527ad2"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "FK_c8db5603420d119933bbc5c398c"`);
        await queryRunner.query(`ALTER TABLE "location_moderations" DROP CONSTRAINT "FK_f05df900c0d81a962e3adf04a0f"`);
        await queryRunner.query(`ALTER TABLE "location_moderations" DROP CONSTRAINT "FK_206a00827ea3483d9d11afd47cf"`);
        await queryRunner.query(`ALTER TABLE "images_reviews" DROP CONSTRAINT "FK_d1c9500b68ca7723d3850ecc04f"`);
        await queryRunner.query(`ALTER TABLE "images_locations" DROP CONSTRAINT "FK_6bb7e23db4d1689f5bfa8ba44e1"`);
        await queryRunner.query(`DROP INDEX "IDX_a35cf4f476556a3259355c1b33"`);
        await queryRunner.query(`DROP INDEX "IDX_f4fc86b14ab3e056e779069283"`);
        await queryRunner.query(`DROP TABLE "locations_hashtags_hashtags"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`DROP TABLE "images_activity"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "images_category"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "estimations"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "location_moderations"`);
        await queryRunner.query(`DROP TABLE "images_reviews"`);
        await queryRunner.query(`DROP TABLE "images_locations"`);
        await queryRunner.query(`DROP TABLE "hashtags"`);
    }

}
