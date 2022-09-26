import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { EnvList } from "src/enums/env";
import { Client } from "@elastic/elasticsearch";
import { ConfigService } from "@nestjs/config";
import { IndexList } from "src/enums/es_index";
import { DeleteByQuery, Msearch, Search } from "@elastic/elasticsearch/api/requestParams";
import { TransportRequestOptions } from "@elastic/elasticsearch/lib/Transport";
import { location } from "./mapping";

@Injectable()
export class ESService implements OnApplicationBootstrap {
  private client: Client;

  private esMode: boolean;

  constructor(private configService: ConfigService) {}

  async onApplicationBootstrap() {
    const appMode = this.configService.get<string>(EnvList.APP_MODE);

    try {
      this.client = new Client({ node: this.configService.get<string>(EnvList.ES_HOST) });
      const esMode = this.configService.get<string>(EnvList.ES_MODE);

      this.esMode = esMode && esMode === "OFF";
    } catch (error) {
      console.log("ES connected failed", error);
      process.exit();
    }

    try {
      if (this.esMode || appMode !== "seed") return;

      try {
        await this.client.indices.get({ index: IndexList.LOCATION });
      } catch (error) {
        if (error.meta && error.statusCode === 404) {
          await this.client.indices.create({
            index: IndexList.LOCATION,
            body: location,
          });

          console.log("Index Location was created successfully");

          return;
        }

        throw error;
      }
    } catch (error) {
      console.log("Error by creating indices", error);
      process.exit();
    }
  }

  async createEntity<T>(index: IndexList, body: T): Promise<void> {
    if (this.esMode) return;

    await this.client.index({
      index,
      body,
    });
  }

  async updateIndex(index: IndexList, id: string, body: any): Promise<void> {
    if (this.esMode) return;
    await this.client.update({ index, id, body });
  }

  async search(params: Search, options?: TransportRequestOptions) {
    if (this.esMode) return { body: { hits: { hits: [] } } };
    return await this.client.search(params, options);
  }

  async msearch(params: Msearch, options?: TransportRequestOptions) {
    if (this.esMode) return { body: { hits: { hits: null } } };
    return await this.client.msearch(params, options);
  }

  async deleteEntity(params: DeleteByQuery) {
    if (this.esMode) return;
    await this.client.deleteByQuery(params);
  }
}
