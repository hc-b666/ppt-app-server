import { type Presentation } from "@prisma/client";
import prisma from "../../utils/prisma";
import { type CreatePresentationDto } from "./dto/create.dto";
import { type Result } from "../../types/result";

class PresentationService {
  private prisma = prisma;
  private static instance: PresentationService;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new PresentationService();
    }

    return this.instance;
  }

  async findAll(): Promise<Result<Presentation[]>> {
    try {
      const ppts = await this.prisma.presentation.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return { success: true, data: ppts };
    } catch (err) {
      console.log("PresentationService.findAll()", err);
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("Unexpected error occured!"),
      };
    }
  }

  async findById(id: string): Promise<Result<Presentation>> {
    try {
      const ppt = await this.prisma.presentation.findUnique({
        where: {
          id,
        },
      });
      if (!ppt) {
        return {
          success: false,
          error: new Error("Presentation not found"),
        };
      }

      return { success: true, data: ppt };
    } catch (err) {
      console.log("Presentation.findById()", err);
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("Unexpected error occured!"),
      };
    }
  }

  async create(dto: CreatePresentationDto): Promise<Result<boolean>> {
    try {
      await this.prisma.presentation.create({
        data: {
          author: dto.author,
          title: dto.title,
          description: dto.description,
        },
      });

      return { success: true, data: true };
    } catch (err) {
      console.log("PresentationService.create()", err);
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("Unexpected error occured"),
      };
    }
  }
}

export default PresentationService;
