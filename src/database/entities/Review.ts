import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import ImageReviewEntity from "./images/ImageReview";
import EstimationEntity from "./Estimation";
import UserEntity from "./User";
import LocationEntity from "./Location";

@Entity({ name: "reviews" })
@ObjectType()
export default class ReviewEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @Column({ name: "description", type: "text" })
  @Field()
  description: string;

  @OneToMany(() => ImageReviewEntity, image => image.review, { cascade: true, onDelete: "CASCADE" })
  images?: ImageReviewEntity[];

  @Column({ name: "rating", type: "numeric" })
  @Field()
  rating: number;

  @Column({ name: "recommendation", type: "boolean" })
  @Field()
  isRecommend: boolean;

  @OneToMany(() => EstimationEntity, estimation => estimation.review, { cascade: ["remove"], onDelete: "CASCADE" })
  estimations?: EstimationEntity[];

  @ManyToOne(() => UserEntity, user => user.reviews)
  user: UserEntity;

  @ManyToOne(() => LocationEntity, location => location.reviews)
  location: LocationEntity;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
