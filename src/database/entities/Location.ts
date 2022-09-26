import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import HashTag from "./Hashtag";
import { Field, ObjectType } from "@nestjs/graphql";
import ImageLocationEntity from "./images/ImageLocation";
import ReviewEntity from "./Review";
import UserEntity from "./User";
import CategoryEntity from "./Category";
import ActivityEntity from "./Activity";
import LocationCheckEntity from "./LocationCheck";
import SeasonEntity from "./Season";
import { GeoPointDto } from "../../geo/dto/point";

@Entity({ name: "locations" })
@ObjectType()
export default class LocationEntity {
  @PrimaryGeneratedColumn("uuid", { name: "id" })
  @Field()
  id: string;

  @Column({ name: "title", type: "varchar" })
  @Field()
  title: string;

  @Column({ name: "description", type: "text" })
  @Field()
  description: string;

  @Column({
    name: "point",
    type: "geometry",
    spatialFeatureType: "Point",
  })
  @Field()
  point: GeoPointDto;

  @Column({ name: "rating", type: "numeric" })
  @Field()
  rating: number;

  @OneToMany(() => ImageLocationEntity, image => image.location, { cascade: true, onDelete: "CASCADE" })
  images: ImageLocationEntity[];

  @ManyToMany(() => HashTag, hashtag => hashtag.locationList, { cascade: ["insert"] })
  @JoinTable()
  hashtags: HashTag[];

  @OneToMany(() => ReviewEntity, review => review.location, { onDelete: "CASCADE" })
  reviews?: ReviewEntity[];

  @ManyToOne(() => CategoryEntity, category => category.locations)
  category: CategoryEntity;

  @ManyToMany(() => ActivityEntity, activity => activity.locations, { onDelete: "CASCADE", cascade: true })
  @JoinTable({ name: "locations_activities" })
  activities: ActivityEntity[];

  @ManyToOne(() => UserEntity, user => user.locations)
  user: UserEntity;

  @OneToOne(() => LocationCheckEntity, locationCheck => locationCheck.location, { onDelete: "CASCADE" })
  locationCheck: LocationCheckEntity;

  @ManyToMany(() => UserEntity, user => user.locations_favorites, { onDelete: "CASCADE", cascade: true })
  @JoinTable({ name: "favorites_locations" })
  users_favorites?: UserEntity[];

  @ManyToMany(() => SeasonEntity, season => season.locations, { onDelete: "CASCADE", cascade: true })
  @JoinTable({ name: "locations_season" })
  seasons: SeasonEntity[];

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
