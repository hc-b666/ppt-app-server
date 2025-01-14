import prisma from "../../utils/prisma";
import { CreatePresentationDto } from "./dto/create.dto";

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

  async findAll() {
    try {
      const ppts = await this.prisma.presentation.findMany();
      
      return ppts;
    } catch (err) {
      console.log("PresentationService.findAll()", err);
      return false;
    }
  }

  async create(dto: CreatePresentationDto) {
    try {
      await this.prisma.presentation.create({
        data: {
          author: dto.author,
          title: dto.title,
          description: dto.description,
        },
      });

      return true;
    } catch (err) {
      console.log("PresentationService.create()", err);
      return false;
    }
  }
}

export default PresentationService;
