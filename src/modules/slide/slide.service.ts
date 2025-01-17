import prisma from "../../utils/prisma";
import { type Result } from "../../types/result";
import { Slide } from "@prisma/client";

type Slides = Omit<Slide, "presentationId" | "createdAt" | "updatedAt">[];

interface SlideServiceInterface {
  findAll(pptId: string): Promise<Result<Slides>>;
  create(pptId: string): Promise<Result<boolean>>;
}

class SlideService implements SlideServiceInterface {
  private prisma = prisma;
  private static instance: SlideService;

  private constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new SlideService();
    }

    return this.instance;
  }

  async findAll(pptId: string): Promise<Result<Slides>> {
    try {
      const ppt = await this.prisma.presentation.findUnique({
        select: {
          slides: {
            select: {
              id: true,
              order: true,
            },
          },
        },
        where: { id: pptId },
      });
      if (!ppt) {
        return {
          success: false,
          error: new Error("Presentation not found"),
        };
      }

      return { success: true, data: ppt.slides };
    } catch (err) {
      console.log("SlideService.findAll()", err);
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("Unexpected error occured"),
      };
    }
  }

  async create(pptId: string): Promise<Result<boolean>> {
    try {
      const ppt = await this.prisma.presentation.findUnique({
        include: {
          slides: true,
        },
        where: { id: pptId },
      });
      if (!ppt) {
        return {
          success: false,
          error: new Error("Presentation not found"),
        };
      }

      const nextSlideOrder = ppt.slides.length + 1;

      await this.prisma.slide.create({
        data: {
          presentationId: pptId,
          order: nextSlideOrder,
        },
      });

      return { success: true, data: true };
    } catch (err) {
      console.log("SlideService.create()", err);
      return {
        success: false,
        error:
          err instanceof Error ? err : new Error("Unexpected error occured"),
      };
    }
  }
}

export default SlideService;
