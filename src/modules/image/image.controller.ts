import { Controller, Get, Param, Res } from "@nestjs/common";
import { ImageService } from "./image.service";
import { Response } from "express";

@Controller("api/image")
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get("/:id")
  public getImage(@Res() res: Response, @Param("id") id: string) {
    this.imageService
      .getImage(id)
      .pipe(res)
      .on("finish", () => {
        res.send();
      });
  }
}
