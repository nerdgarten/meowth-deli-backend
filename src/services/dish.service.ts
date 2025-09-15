import DishRepository from "@/repositories/dish.repository";
import { AppError } from "@/types/error";

export default class DishService {
  private dishRepository: DishRepository;

  constructor() {
    this.dishRepository = new DishRepository();
  }

  async searchDishes(keyword: string, limit: number, offset: number) {
    if (!keyword || keyword.trim() === "") {
      throw new AppError("Keyword cannot be empty", 400);
    }

    const whereClause = {
      OR: [
        {
          name: {
            contains: keyword,
            mode: "insensitive" as const,
          },
        },
        {
          detail: {
            contains: keyword,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    const dishes = await this.dishRepository.findDishesByKeyword(
      whereClause,
      limit,
      offset
    );

    return dishes;
  }
}
