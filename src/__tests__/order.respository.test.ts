import OrderRespository from "@/repositories/order.respository";
import { AppError } from "@/types/error";
import { StatusCodes } from "http-status-codes";

describe("OrderRespository.calculateTotalAmount", () => {
  let repository: OrderRespository;

  beforeEach(() => {
    repository = new OrderRespository();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

    it("sums the price*amount of each dish in an order", async () => {
      const getOrderSpy = jest
        .spyOn(repository, "getOrderById")
        .mockResolvedValue({
          orderDishes: [
            { amount: 2, dish: { price: 150 } },
            { amount: 1, dish: { price: 50 } },
            { amount: 3, dish: { price: 20 } },
          ],
        } as Awaited<ReturnType<typeof repository.getOrderById>>);

    const total = await repository.calculateTotalAmount(99);

    expect(getOrderSpy).toHaveBeenCalledWith(99);
    expect(total).toBe(2 * 150 + 1 * 50 + 3 * 20);
  });


  it("handles decimal dish prices and aggregates precisely", async () => {
    jest.spyOn(repository, "getOrderById").mockResolvedValue({
      orderDishes: [
        { amount: 2, dish: { price: 19.99 } },
        { amount: 5, dish: { price: 9.5 } },
      ],
    } as Awaited<ReturnType<typeof repository.getOrderById>>);

    const total = await repository.calculateTotalAmount(77);

    expect(total).toBeCloseTo(2 * 19.99 + 5 * 9.5);
  });

  it("throws an AppError when the order cannot be found", async () => {
    jest.spyOn(repository, "getOrderById").mockResolvedValue(null);

    await expect(repository.calculateTotalAmount(42)).rejects.toMatchObject({
      message: "Order not found",
      statusCode: StatusCodes.NOT_FOUND,
    });
  });
});
