import { Field, ObjectType } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, DeleteDateColumn, Column } from "typeorm";
import Review from "./Review";
import UserEntity from "./User";

@Entity({ name: "estimations" })
@ObjectType()
export default class EstimationEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @ManyToOne(() => Review, review => review.images, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  review: Review;

  @Column({ name: "sign", type: "boolean" })
  @Field()
  sign: boolean;

  @ManyToOne(() => UserEntity, estimation => estimation.estimations, { onDelete: "CASCADE" })
  user: UserEntity;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
