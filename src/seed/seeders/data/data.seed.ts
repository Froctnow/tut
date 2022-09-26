/* eslint-disable no-await-in-loop */
/* eslint-disable multiline-comment-style */
import UserEntity from "../../../database/entities/User";
import RoleEntity from "../../../database/entities/Role";
import HashtagEntity from "../../../database/entities/Hashtag";
import ImageLocationEntity from "../../../database/entities/images/ImageLocation";
import ImageReviewEntity from "../../../database/entities/images/ImageLocation";
import LocationEntity from "../../../database/entities/Location";
import ReviewEntity from "../../../database/entities/Review";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { doInParallel } from "../../../utils";
import faker from "faker";
import AWS from "aws-sdk";
import fs from "fs";
import { v4 } from "uuid";
import { IndexList } from "../../../enums/es_index";
import { Client } from "@elastic/elasticsearch";
import { createImage, storage } from "../utils";
import CategoryEntity from "../../../database/entities/Category";
import ActivityEntity from "../../..//database/entities/Activity";
import LocationCheckEntity from "../../../database/entities/LocationCheck";
import { LocationCheckStatuses } from "../../../enums/location.check.status";
import SeasonEntity from "../../../database/entities/Season";

async function generateRandomCountImages(factory, readStream: fs.ReadStream, entity, storage: AWS.S3) {
  const count = faker.datatype.number({ min: 3, max: 10 });
  const images: typeof entity[] = [];

  await doInParallel(Array(count).fill({}), async () => {
    const imageKey = v4();

    await createImage(readStream, imageKey, storage);

    images.push(await factory(entity)().make({ id: imageKey }));
  });

  return images;
}

async function createIndex(index: IndexList, body: any, clientES: Client): Promise<any> {
  const isMode = process.env.ES_MODE;

  if (isMode && isMode === "OFF") return;

  return await clientES.index({
    index,
    body,
  });
}

async function updateIndex(index: IndexList, id: string, body: any, clientES: Client): Promise<void> {
  const isMode = process.env.ES_MODE;

  if (isMode && isMode === "OFF") return;

  await clientES.update({
    id,
    index,
    body,
  });
}

export default class DataSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const roles = await factory(RoleEntity)().createMany(5, { name: "user" });
    const users: UserEntity[] = [];
    const clientES = new Client({ node: process.env.ES_HOST });

    const imagePath = `${process.cwd()}/src/seed/fakeimg.pl.png`;

    const readStream = fs.createReadStream(imagePath);

    const categories: CategoryEntity[] = await connection.query("SELECT * FROM categories");
    const activities: ActivityEntity[] = await connection.query("SELECT * FROM activities");
    const seasons: SeasonEntity[] = await connection.query("SELECT * FROM seasons");

    await doInParallel(roles, async role => {
      const user = await factory(UserEntity)().create({ roles: [role] });

      users.push(user);
    });

    const userLocation = new Map<string, { es_id: string; locations: LocationEntity[] }>();

    // Если убрано "unique" у тэга, тогда раскоментировать
    async function createHashtag() {
      try {
        return await factory(HashtagEntity)().create();
      } catch (error) {
        if (!error.message.includes("duplicate key value")) return;

        return await createHashtag();
      }
    }

    await doInParallel(users, async user => {
      const hashtags: HashtagEntity[][] = [];

      const countLocation = faker.datatype.number({ min: 1, max: 3 });

      for (let i = 0; i < countLocation; i++) {
        hashtags.push([]);
      }

      await doInParallel(hashtags, async () => {
        await doInParallel(Array(faker.datatype.number({ min: 1, max: 5 })).fill(0), async () => {
          // Если сверху функция раскоментирована, то используйте "factory"
          const h = await createHashtag();
          // const h = await factory(HashtagEntity)().create();

          hashtags[faker.datatype.number({ min: 0, max: countLocation - 1 })].push(h);
        });
      });

      await doInParallel(hashtags, async hashtags => {
        const images = await generateRandomCountImages(factory, readStream, ImageLocationEntity, storage);
        const categoryRandom = faker.datatype.number(categories.length - 1);
        const activityRandom = faker.datatype.number(activities.length - 1);
        const seasonRandom = faker.datatype.number(seasons.length - 1);

        const category = await factory(CategoryEntity)().make({
          id: categories[categoryRandom].id,
          name: categories[categoryRandom].name,
          code: categories[categoryRandom].code,
        });
        const activity = await factory(ActivityEntity)().make({
          id: activities[activityRandom].id,
          name: activities[activityRandom].name,
          code: activities[activityRandom].code,
        });
        const season = await factory(SeasonEntity)().make({
          id: seasons[seasonRandom].id,
          name: seasons[seasonRandom].name,
          code: seasons[seasonRandom].code,
        });
        const location = await factory(LocationEntity)().create({ user, hashtags, images, category, activities: [activity], seasons: [season] });

        await factory(LocationCheckEntity)().create({ location, status: LocationCheckStatuses.APPROVED });

        const response = await createIndex(
          IndexList.LOCATION,
          {
            id: location.id,
            description: location.description,
            title: location.title,
            hashtags: hashtags.map(h => h.name),
            reviews: [],
            category: category.name,
            activities: [activity.name],
            seasons: [season.name],
            status: LocationCheckStatuses.APPROVED,
          },
          clientES,
        );

        const locationMap = userLocation.get(user.id);

        userLocation.set(user.id, { es_id: response?.body._id, locations: locationMap ? [location, ...locationMap.locations] : [] });
      });
    });

    await doInParallel(users, async user => {
      const locations: LocationEntity[] = [];

      for (const [userMap, struct] of userLocation) {
        if (userMap === user.id) continue;

        for (const location of struct.locations) {
          locations.push(location);
        }
      }

      for (const location of locations) {
        const images = await generateRandomCountImages(factory, readStream, ImageReviewEntity, storage);

        const review = await factory(ReviewEntity)().create({ location, images, user });

        const indexId = userLocation.get(user.id).es_id;

        try {
          await updateIndex(
            IndexList.LOCATION,
            indexId,
            {
              script: {
                source: "ctx._source.reviews.add(params.review)",
                params: { review: { description: review.description } },
              },
            },
            clientES,
          );
        } catch (e) {
          console.log(e.meta.body.error);
          throw e;
        }
      }
    });
  }
}
