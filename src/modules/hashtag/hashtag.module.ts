import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import HashtagEntity from "src/database/entities/Hashtag";
import { HashtagService } from "./hashtag.service";

@Module({
  imports: [TypeOrmModule.forFeature([HashtagEntity])],
  providers: [HashtagService],
  exports: [TypeOrmModule.forFeature([HashtagEntity]), HashtagService],
})
export class HashtagModule {}
