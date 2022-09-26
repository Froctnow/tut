import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import UserEntity from "./User";
import LocationEntity from "./Location";

@Entity({ name: "location_moderations" })
@ObjectType()
export default class LocationCheckEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @Column()
  @Field()
  status: string;

  @OneToOne(() => LocationEntity, location => location.locationCheck)
  @JoinColumn()
  location: LocationEntity;

  @ManyToOne(() => UserEntity, user => user.locationChecks, { nullable: true })
  reviewer: UserEntity;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
