import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, DeleteDateColumn } from "typeorm";
import Location from "../Location";

@Entity({ name: "images_locations" })
@ObjectType()
export default class ImageLocationEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @ManyToOne(() => Location, location => location.images, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  location: Location;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
