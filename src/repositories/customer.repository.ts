import { prisma } from "@/libs/prisma";
import { ICustomer, ICustomerProfile, ICreateOrderRepository } from "@/types/user";
import { type Order, type OrderDish, type Dish, OrderStatus, VerificationStatus} from "@/generated/prisma/client";
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

  async createOrder(data: ICreateOrderRepository): Promise<Order & { orderDishes: OrderDish[] }> {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          customer_id: data.customerId,
          restaurant_id: data.restaurant_id, // Add restaurant_id
          status: OrderStatus.pending,
          location: data.location,
          remark: data.note ?? null,
          total_amount: data.total_amount,
          driver_fee: data.driver_fee,
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

  async getDishesWithDetails(dishIds: number[], restaurantId: number) {
    return prisma.dish.findMany({
      where: {
        id: { in: dishIds },
        restaurant_id: restaurantId,
        is_out_of_stock: false
      },
      select: {
        id: true,
        name: true, 
        price: true,
        restaurant_id: true
      }
    })
  }
  async getOrderWithDetails(orderId: number, customerId: number) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        customer_id: customerId,
      },
      include: {
        customer: {
          select: {
            firstname: true,
            lastname: true,
            tel: true,
          },
        },
        driver: {
          select: {
            firstname: true,
            lastname: true,
            tel: true,
          },
        },
        orderDishes: {
          include: {
            dish: {
              select: {
                id: true,
                name: true,
                detail: true,  // Changed from description
                price: true,
                allergy: true,
                is_out_of_stock: true,
                restaurant: {
                  select: {
                    name: true,
                    location: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          include: {
            paymentMethod: {
              select: {
                id: true,
                title: true,
                type: true,
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  // Get all customer orders with optional status filter
  async getCustomerOrders(
    customerId: number,
    statusFilter?: OrderStatus
  ) {
    const whereClause: { customer_id: number; status?: OrderStatus } = {
      customer_id: customerId,
    };

    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    return prisma.order.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            orderDishes: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // Update order status
  async updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus, // Cast to match Prisma enum type
        updated_at: new Date(),
      },
    });
  }

  // Create payment record
  async createPayment(paymentData: {
    order_id: number;
    payment_method_id: number;
    status: VerificationStatus;
    image: string | null;
  }) {
    return prisma.payment.create({
      data: {
        order_id: paymentData.order_id,
        payment_method_id: paymentData.payment_method_id,
        status: paymentData.status,
        image: paymentData.image,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  // Get payment methods
  async getPaymentMethods() {
    return prisma.paymentMethod.findMany({
      select: {
        id: true,
        title: true,  // Changed from name
        type: true,
      },
    });
  }
  getCustomerOrderHistory(
    userId: number,
    options?: {
      page?: number;
      limit?: number;
      status?: OrderStatus;
      sortBy?: "created_at" | "total_amount";
      sortOrder?: "asc" | "desc";
    }
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where: { customer_id: number; status?: OrderStatus } = {
      customer_id: userId,
      ...(options?.status && { status: options.status as OrderStatus }),
    };

    const orderBy = {
      [options?.sortBy || "created_at"]: options?.sortOrder || "desc",
    };

    return prisma.$transaction([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          location: true,
          status: true,
          remark: true,
          total_amount: true,
          driver_fee: true,
          created_at: true,
          updated_at: true,
          driver: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              tel: true,
              vehicle: true,
              fee_rate: true,
              image: true,
            },
          },
          orderDishes: {
            select: {
              amount: true,
              remark: true,
              dish: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  detail: true,
                  allergy: true,
                  is_out_of_stock: true,
                  restaurant: {
                    select: {
                      id: true,
                      name: true,
                      location: true,
                      tel: true,
                      image: true,
                      fee_rate: true,
                      is_available: true,
                    },
                  },
                },
              },
            },
          },
          payments: {
            select: {
              id: true,
              payment_method_id: true,
              image: true,
              status: true,
              created_at: true,
              paymentMethod: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  detail: true,
                },
              },
            },
          },
        },
      }),
    ]);
  }

  getCustomerOrderById(userId: number, orderId: number) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        customer_id: userId,
      },
      select: {
        id: true,
        location: true,
        status: true,
        remark: true,
        total_amount: true,
        driver_fee: true,
        created_at: true,
        updated_at: true,
        driver: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            tel: true,
            vehicle: true,
            licence: true,
            fee_rate: true,
            image: true,
            is_available: true,
            verification_status: true,
          },
        },
        orderDishes: {
          select: {
            amount: true,
            remark: true,
            dish: {
              select: {
                id: true,
                name: true,
                price: true,
                detail: true,
                allergy: true,
                is_out_of_stock: true,
                restaurant: {
                  select: {
                    id: true,
                    name: true,
                    location: true,
                    tel: true,
                    image: true,
                    detail: true,
                    fee_rate: true,
                    is_available: true,
                    verification_status: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          select: {
            id: true,
            payment_method_id: true,
            image: true,
            status: true,
            created_at: true,
            updated_at: true,
            paymentMethod: {
              select: {
                id: true,
                title: true,
                type: true,
                detail: true,
              },
            },
          },
        },
      },
    });
  }

  getOrderStatistics(userId: number) {
    return prisma.order.groupBy({
      by: ["status"],
      where: {
        customer_id: userId,
      },
      _count: {
        id: true,
      },
      _sum: {
        total_amount: true,
      },
    });
  }
}
