import { Args, Query, Resolver } from "@nestjs/graphql";
import { SeasonService } from "./season.service";
import SeasonEntity from "src/database/entities/Season";

@Resolver("Season")
export class SeasonResolver {
  constructor(private seasonService: SeasonService) {}

  @Query(() => [SeasonEntity])
  async seasonList(): Promise<SeasonEntity[]> {
    return await this.seasonService.getAll();
  }

  @Query(() => SeasonEntity)
  async seasonGetById(@Args("id") id: string): Promise<SeasonEntity> {
    return await this.seasonService.getById(id);
  }
}
