import { prisma } from "@/libs/prisma";
import { ICustomerProfile } from "@/types/user";
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
  getCustomerOrderHistory(
    userId: number,
    options?: {
      page?: number;
      limit?: number;
      status?: string;
      sortBy?: "created_at" | "total_amount";
      sortOrder?: "asc" | "desc";
    }
  ) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const where = {
      customer_id: userId,
      ...(options?.status && { status: options.status as any }),
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
