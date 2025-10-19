import { prisma } from "@/libs/prisma";
import { ICustomerProfile } from "@/types/order";

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
  async getCustomerOrders(customerId: number, statusFilter?: string) {
    const whereClause: any = {
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
  async updateOrderStatus(orderId: number, newStatus: string) {
    return prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus as any, // Cast to match Prisma enum type
        updated_at: new Date(),
      },
    });
  }

  // Create payment record
  async createPayment(paymentData: {
    order_id: number;
    payment_method_id: number;
    status: any; // Will be cast to $Enums.VerificationStatus
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
}
