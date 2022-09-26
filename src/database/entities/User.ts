import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany, UpdateDateColumn, ManyToMany } from "typeorm";
import EstimationEntity from "./Estimation";
import LocationEntity from "./Location";
import LocationCheckEntity from "./LocationCheck";
import ReviewEntity from "./Review";
import RoleEntity from "./Role";

@Entity({ name: "users" })
@ObjectType()
export default class UserEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @Column({ name: "email", type: "varchar", unique: true, nullable: true })
  @Field()
  email?: string;

  @Column({ name: "firstName", type: "varchar" })
  @Field()
  firstName: string;

  @Column({ name: "externalId", type: "varchar", unique: true, nullable: true })
  externalId: string;

  @Column({ name: "lastName", type: "varchar", nullable: true })
  @Field({ nullable: true })
  lastName?: string;

  @Column({ name: "displayName", type: "varchar", nullable: true })
  @Field({ nullable: true })
  displayName?: string;

  @Column({ name: "password", type: "varchar", nullable: true })
  @Field({ nullable: true })
  password?: string;

  @Column({ name: "verifyToken", type: "varchar", nullable: true })
  @Field({ nullable: true })
  verifyToken?: string;

  @OneToMany(() => RoleEntity, role => role.user, { cascade: true })
  roles: RoleEntity[];

  @OneToMany(() => LocationEntity, location => location.user, { onDelete: "CASCADE" })
  locations?: LocationEntity[];

  @OneToMany(() => ReviewEntity, review => review.user, { onDelete: "CASCADE" })
  reviews?: ReviewEntity[];

  @OneToMany(() => EstimationEntity, estimation => estimation.user, { onDelete: "CASCADE" })
  estimations?: EstimationEntity[];

  @OneToMany(() => LocationCheckEntity, locationCheck => locationCheck.reviewer, { onDelete: "CASCADE" })
  locationChecks?: LocationCheckEntity[];

  @ManyToMany(() => LocationEntity, location => location.users_favorites)
  locations_favorites: LocationEntity[];

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
