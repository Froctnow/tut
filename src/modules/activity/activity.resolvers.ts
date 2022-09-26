import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "src/enums/roles";
import { Void } from "src/graphql/scalar.void";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { ActivityService } from "./activity.service";
import { RolesAccess } from "src/decorators/roles";
import ActivityEntity from "src/database/entities/Activity";
import { FileUpload, GraphQLUpload } from "graphql-upload";

@Resolver("Activity")
export class ActivityResolver {
  constructor(private activityService: ActivityService) {}

  @Query(() => [ActivityEntity])
  async activityList(): Promise<ActivityEntity[]> {
    return await this.activityService.getAll();
  }

  @Query(() => ActivityEntity)
  async activityGetById(@Args("id") id: string): Promise<ActivityEntity> {
    return await this.activityService.getById(id);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesAccess(Roles.ADMIN)
  @Mutation(() => Void, { nullable: true })
  async activityCreate(
    @Args({ name: "name", type: () => String }) name: string,
    @Args({ name: "file", type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<void> {
    await this.activityService.create(name, file);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesAccess(Roles.ADMIN)
  @Mutation(() => Void, { nullable: true })
  async activityDelete(@Args("id") id: string): Promise<void> {
    await this.activityService.delete(id);
  }
}
