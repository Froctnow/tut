import { ObjectType, Field } from "@nestjs/graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne } from "typeorm";
import User from "./User";

@Entity({ name: "roles" })
@ObjectType()
export default class RoleEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @Column({ name: "name", type: "varchar" })
  @Field()
  name: string;

  @ManyToOne(() => User, user => user.roles, { onDelete: "CASCADE" })
  user: User;

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
