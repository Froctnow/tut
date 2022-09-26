import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, DeleteDateColumn } from "typeorm";
import Review from "../Review";

@Entity({ name: "images_reviews" })
@ObjectType()
export default class ImageReviewEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @ManyToOne(() => Review, review => review.images, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  review: Review;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
