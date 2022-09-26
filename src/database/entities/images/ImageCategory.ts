import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: "images_category" })
@ObjectType()
export default class ImageCategoryEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
