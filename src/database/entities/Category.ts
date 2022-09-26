import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Column,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import LocationEntity from "./Location";
import ImageCategoryEntity from "./images/ImageCategory";

@Entity({ name: "categories" })
@ObjectType()
export default class CategoryEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @Column({ name: "name", type: "varchar", unique: true })
  @Field()
  name: string;

  @Column({ name: "code", type: "varchar", unique: true })
  @Field()
  code: string;

  @OneToOne(() => ImageCategoryEntity, { cascade: true })
  @JoinColumn()
  image: ImageCategoryEntity;

  @OneToMany(() => LocationEntity, location => location.category)
  locations: LocationEntity[];

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
