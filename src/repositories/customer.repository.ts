import { prisma } from "@/libs/prisma";
import { ICustomerProfile, ICreateOrderRepository } from "@/types/user";
import { type Order, type OrderDish, type Dish, OrderStatus} from "@/generated/prisma/client";


export default class CustomerRepository {
  getCustomerProfile(userId: number) {
    return prisma.customer.findFirst({
      where: {
        id: userId,
      },
      select: {
        firstname: true,
        lastname: true,
        tel: true,
      },
    });
  }

  updateCustomerProfile(userId: number, data: Partial<ICustomerProfile>) {
    return prisma.customer.update({
      where: {
        id: userId,
      },
      data: data,
      select: {
        firstname: true,
        lastname: true,
        tel: true,
      },
    });
  }
  async getDishesWithDetails(names: string[]) {
    return prisma.dish.findMany({
      where: {
        name: { in: names },
        is_out_of_stock: false
      },
      select: {
        id: true,
        name: true, 
        price: true,
        restaurant_id: true
      }
    });
  }

  async createOrder(data: ICreateOrderRepository): Promise<Order & { orderDishes: OrderDish[] }> {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customer_id: data.customerId,
          status: OrderStatus.pending,
          location: data.location,
          remark: data.note ?? null,
          total_amount: 0,
          driver_fee: 0,
          driver_id: null
        }
      });

      await tx.orderDish.createMany({
        data: data.dishes.map(dish => ({
          order_id: order.id,
          dish_id: dish.dishId,
          amount: dish.quantity,
          remark: dish.note ?? null
        }))
      });

      return {
        ...order,
        orderDishes: await tx.orderDish.findMany({
          where: { order_id: order.id }
        })
      };
    });
  }
}
