import { type Slide, type Presentation } from "@prisma/client";
import crypto from "crypto";
import prisma from "../../utils/prisma";
import { type CreatePresentationDto } from "./dto/create.dto";
import { type Result } from "../../types/result";

type PresentationWithoutToken = Omit<Presentation, "authorToken">;

interface CreateResponse {
  presentationId: string;
  authorToken: string;
}

interface PresentationServiceInterface {
  isAuthor(authorToken: string, id: string): Promise<Result<boolean>>;
  findAll(): Promise<Result<PresentationWithoutToken[]>>;
  findById(id: string): Promise<Result<PresentationWithoutToken>>;
  create(dto: CreatePresentationDto): Promise<Result<CreateResponse>>;
  updateTitle(id: string, title: string): Promise<Result<boolean>>;
}

class PresentationService implements PresentationServiceInterface {
  private prisma = prisma;
  private static instance: PresentationService;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new PresentationService();
    }

    return this.instance;
  }

  async isAuthor(authorToken: string, id: string): Promise<Result<boolean>> {
    try {
      const ppt = await this.prisma.presentation.findUnique({
        where: {
          id,
          authorToken,
        },
      });
      if (!ppt) {
        return {
          success: false,
          error: new Error("Presentation not found"),
        };
      }

      return { success: true, data: true };
    } catch (err) {
      console.log("PresentationService.isAuthor()", err);
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("Unexpected error occured!"),
      };
    }
  }

  async findAll(): Promise<Result<PresentationWithoutToken[]>> {
    try {
      const ppts = await this.prisma.presentation.findMany({
        select: {
          id: true,
          author: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
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

  async findById(id: string): Promise<Result<PresentationWithoutToken>> {
    try {
      const ppt = await this.prisma.presentation.findUnique({
        select: {
          id: true,
          author: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
        },
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

  async create(dto: CreatePresentationDto): Promise<Result<CreateResponse>> {
    try {
      const authorToken = crypto.randomUUID();

      const ppt = await this.prisma.presentation.create({
        data: {
          author: dto.author,
          authorToken,
          title: dto.title,
          description: dto.description,
        },
      });

      return {
        success: true,
        data: { presentationId: ppt.id, authorToken },
      };
    } catch (err) {
      console.log("PresentationService.create()", err);
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("Unexpected error occured"),
      };
    }
  }

  async updateTitle(id: string, title: string): Promise<Result<boolean>> {
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

      await this.prisma.presentation.update({
        data: {
          title,
        },
        where: {
          id,
        },
      });

      return { success: true, data: true };
    } catch (err) {
      console.log("PresentationService.updateTitle()", err);
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("Unexpected error occured"),
      };
    }
  }
}

export default PresentationService;
