import {MigrationInterface, QueryRunner} from "typeorm";

export class AddFavorites1635430969231 implements MigrationInterface {
    name = 'AddFavorites1635430969231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "favorites_locations" ("locationsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_74659eda89859d2f9315c7ccc69" PRIMARY KEY ("locationsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_849a110c65abb62e9baa3b1370" ON "favorites_locations" ("locationsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_747e1528a66b2bdc3bc6bb7af1" ON "favorites_locations" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "favorites_locations" ADD CONSTRAINT "FK_849a110c65abb62e9baa3b1370f" FOREIGN KEY ("locationsId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "favorites_locations" ADD CONSTRAINT "FK_747e1528a66b2bdc3bc6bb7af1d" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favorites_locations" DROP CONSTRAINT "FK_747e1528a66b2bdc3bc6bb7af1d"`);
        await queryRunner.query(`ALTER TABLE "favorites_locations" DROP CONSTRAINT "FK_849a110c65abb62e9baa3b1370f"`);
        await queryRunner.query(`DROP INDEX "IDX_747e1528a66b2bdc3bc6bb7af1"`);
        await queryRunner.query(`DROP INDEX "IDX_849a110c65abb62e9baa3b1370"`);
        await queryRunner.query(`DROP TABLE "favorites_locations"`);
    }

}
