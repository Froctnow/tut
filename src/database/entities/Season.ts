import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, DeleteDateColumn } from "typeorm";
import LocationEntity from "./Location";

@Entity({ name: "seasons" })
@ObjectType()
export default class SeasonEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @Column({ name: "name", type: "varchar", unique: true })
  @Field()
  name: string;

  @Column({ name: "code", type: "varchar", unique: true })
  @Field()
  code: string;

  @ManyToMany(() => LocationEntity, location => location.seasons)
  locations?: LocationEntity[];

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
