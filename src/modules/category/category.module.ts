import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import CategoryEntity from "src/database/entities/Category";
import { ImageModule } from "../image/image.module";
import { CategoryResolver } from "./category.resolvers";
import { CategoryService } from "./category.service";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), ImageModule],
  providers: [CategoryResolver, CategoryService],
  exports: [TypeOrmModule.forFeature([CategoryEntity]), CategoryService],
})
export class CategoryModule {}
