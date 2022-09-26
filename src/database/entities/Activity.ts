import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";
import LocationEntity from "./Location";
import ImageActivityEntity from "./images/ImageActivity";

@Entity({ name: "activities" })
@ObjectType()
export default class ActivityEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @Column({ name: "name", type: "varchar", unique: true })
  @Field()
  name: string;

  @Column({ name: "code", type: "varchar", unique: true })
  @Field()
  code: string;

  @ManyToMany(() => LocationEntity, location => location.activities)
  locations?: LocationEntity[];

  @OneToOne(() => ImageActivityEntity, { cascade: true })
  @JoinColumn()
  image: ImageActivityEntity;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
