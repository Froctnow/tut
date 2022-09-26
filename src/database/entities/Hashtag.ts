import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, DeleteDateColumn } from "typeorm";
import Location from "./Location";

@Entity({ name: "hashtags" })
@ObjectType()
export default class HashtagEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @Column({ name: "name", type: "varchar" })
  @Field()
  name: string;

  @ManyToMany(() => Location, location => location.hashtags)
  locationList?: Location[];

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
