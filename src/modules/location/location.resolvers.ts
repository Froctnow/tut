import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { LocationService } from "./location.service";
import { LocationEntity } from "src/database/entities";
import { GetLocationArgs } from "./models/args/location.get";
import { Void } from "src/graphql/scalar.void";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { CurrentUser } from "src/custom_decorators/CurrentUser";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { UserJwtDto } from "../user/dto/user.jwt.dto";
import {
  LocationCreateInputModel,
  LocationDeleteInputModel,
  LocationFavorites,
  LocationSearchResponseModel,
  LocationUpdateInputModel,
  MyLocationsModel,
} from "./models";
import { LocationFullModel } from "./models/location.full";
import { LocationFavoriteModel } from "./models/location.favorite";
import { SearchFilters } from "./models/args/location.search.filters";
import { LocationPoints } from "./models/args/location.points";

@Resolver("Location")
export class LocationsResolver {
  constructor(private locationService: LocationService) {}

  @Query(() => [LocationFullModel])
  async locations(@Args("locationPoints") locationPoints: LocationPoints): Promise<LocationFullModel[]> {
    return await this.locationService.findByPoints(locationPoints);
  }

  @Query(() => LocationFullModel, { nullable: true })
  async locationById(@CurrentUser() user: UserJwtDto, @Args() getLocationArgs: GetLocationArgs): Promise<LocationFullModel> {
    return await this.locationService.findById(getLocationArgs.locationId, user);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => LocationEntity)
  async createLocation(
    @Args("createLocationData") createLocationData: LocationCreateInputModel,
    @Args({ name: "fileList", type: () => [GraphQLUpload] }) fileList: Promise<FileUpload>[],
    @CurrentUser() user: UserJwtDto,
  ) {
    const files = await this.locationService.waitUploadFiles(fileList);

    return await this.locationService.create(createLocationData, user.id, files);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Void, { nullable: true })
  async deleteLocation(@Args("id") id: string, @CurrentUser() user: UserJwtDto): Promise<void> {
    await this.locationService.delete(id, user.id);
  }

  @Query(() => LocationSearchResponseModel, { nullable: true })
  async search(
    @Args() filters: SearchFilters,
    @Args({ name: "from", type: () => Number }) from: number,
    @Args({ name: "size", type: () => Number }) size: number,
    @CurrentUser() user: UserJwtDto,
  ): Promise<LocationSearchResponseModel> {
    return await this.locationService.search(filters, size, from, user);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => LocationFullModel)
  async editLocation(
    @Args("id") id: string,
    @Args("updateLocationInput") updateLocationInput: LocationUpdateInputModel,
    @Args("deleteLocationInput") deleteLocationInput: LocationDeleteInputModel,
    @Args({ name: "fileList", type: () => [GraphQLUpload], nullable: true }) fileList: Promise<FileUpload>[],
    @CurrentUser() user: UserJwtDto,
  ) {
    const files = await this.locationService.waitUploadFiles(fileList);

    return await this.locationService.edit(id, updateLocationInput, deleteLocationInput, files, user);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => LocationFavoriteModel)
  async addLocationToFavorite(@Args("id") id: string, @CurrentUser() user: UserJwtDto): Promise<LocationFavoriteModel> {
    return await this.locationService.addFavorite(id, user);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => LocationFavoriteModel)
  async deleteLocationFavorite(@Args("id") id: string, @CurrentUser() user: UserJwtDto): Promise<LocationFavoriteModel> {
    return await this.locationService.deleteFavorite(id, user);
  }

  @UseGuards(AuthGuard)
  @Query(() => LocationFavorites)
  async getMyFavoritesLocations(
    @CurrentUser() user: UserJwtDto,
    @Args({ name: "from", type: () => Number }) from: number,
    @Args({ name: "size", type: () => Number }) size: number,
  ): Promise<LocationFavorites> {
    return await this.locationService.getMyFavoritesLocations(user, size, from);
  }

  @UseGuards(AuthGuard)
  @Query(() => MyLocationsModel)
  async getMyLocations(
    @CurrentUser() user: UserJwtDto,
    @Args({ name: "from", type: () => Number }) from: number,
    @Args({ name: "size", type: () => Number }) size: number,
  ): Promise<MyLocationsModel> {
    return await this.locationService.getMyLocations(user, size, from);
  }
}
