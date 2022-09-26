import { Args, Query, Resolver } from "@nestjs/graphql";
import { CategoryService } from "./category.service";
import CategoryEntity from "src/database/entities/Category";

@Resolver("Category")
export class CategoryResolver {
  constructor(private categoryService: CategoryService) {}

  @Query(() => [CategoryEntity])
  async categoryList(): Promise<CategoryEntity[]> {
    return await this.categoryService.getAll();
  }

  @Query(() => CategoryEntity)
  async categoryGetById(@Args("id") id: string): Promise<CategoryEntity> {
    return await this.categoryService.getById(id);
  }
}
