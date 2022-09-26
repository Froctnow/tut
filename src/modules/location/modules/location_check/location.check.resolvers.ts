import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "src/custom_decorators/CurrentUser";
import LocationCheckEntity from "src/database/entities/LocationCheck";
import { RolesAccess } from "src/decorators/roles";
import { Roles } from "src/enums/roles";
import { Void } from "src/graphql/scalar.void";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { UserJwtDto } from "src/modules/user/dto/user.jwt.dto";
import { LocationCheckService } from "./location.check.service";

@UseGuards(AuthGuard, RoleGuard)
@RolesAccess(Roles.ADMIN, Roles.MODERATOR)
@Resolver("LocationCheck")
export class LocationCheckResolver {
  constructor(private locationCheckService: LocationCheckService) {}

  @Query(() => LocationCheckEntity, { nullable: true })
  async locationCheckById(@Args("locationCheckId") locationCheckId: string) {
    return this.locationCheckService.findById(locationCheckId);
  }

  @Query(() => [LocationCheckEntity])
  async locationChecks(@Args("skip") skip: number, @Args("take") take: number, @Args("statuses", { type: () => [String] }) statuses: string[]) {
    return this.locationCheckService.findAll(skip, take, statuses);
  }

  @Mutation(() => Void)
  async locationCheckTake(@CurrentUser() user: UserJwtDto, @Args("locationId") locationId: string) {
    await this.locationCheckService.take(locationId, user);
  }

  @Mutation(() => Void)
  async locationCheckUpdateStatus(@CurrentUser() user: UserJwtDto, @Args("locationId") locationId: string, @Args("status") status: string) {
    await this.locationCheckService.updateStatus(locationId, status, user);
  }
}
