import CustomerService from '@/services/customer.service';
import CustomerRepository from '@/repositories/customer.repository';
import { prisma } from '@/libs/prisma';
import { AppError } from '@/types/error';
import { StatusCodes } from 'http-status-codes';
import { ICreateOrderRequest } from '@/types/user';
import { Order, OrderStatus, OrderDish } from '@/generated/prisma/client';

// Mock dependencies
jest.mock('@/libs/prisma', () => ({
  prisma: {
    restaurant: {
      findUnique: jest.fn(),
    },
    dish: {
      findMany: jest.fn(),
    },
    customer: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('CustomerService', () => {
  let customerService: CustomerService;
  let mockCustomerRepository: jest.Mocked<CustomerRepository>;

  beforeEach(() => {
    // Create a mock repository without passing it to the constructor
    mockCustomerRepository = {
      getCustomerProfile: jest.fn(),
      updateCustomerProfile: jest.fn(),
      createOrder: jest.fn(),
      getDishesWithDetails: jest.fn(),
    } as any;

    // Instantiate service without constructor argument
    customerService = new CustomerService();

    // Manually set the repository
    (customerService as any).customerRepository = mockCustomerRepository;
  });

  // Order Creation Tests
  describe('createOrder', () => {
    const mockRestaurant = {
      id: 1,
      name: 'Test Restaurant',
      fee_rate: 0.1,
      is_available: true
    };

    const mockDishDetails = [
      { 
        id: 1, 
        name: 'Dish 1', 
        price: 100, 
        restaurant_id: 1,
        is_out_of_stock: false
      },
      { 
        id: 2, 
        name: 'Dish 2', 
        price: 200, 
        restaurant_id: 1,
        is_out_of_stock: false
      }
    ];

    const validOrderData: ICreateOrderRequest = {
      location: '123 Test Street',
      restaurant_id: 1,
      dishes: [
        { dish_id: 1, quantity: 2 },
        { dish_id: 2, quantity: 1 }
      ]
    };

    // Updated mockOrder to include orderDishes
    const mockOrder: Order & { orderDishes: OrderDish[] } = {
      id: 1,
      customer_id: 1,
      driver_id: null,
      restaurant_id: 1,
      location: '123 Test Street',
      status: OrderStatus.pending,
      remark: null,
      total_amount: 400,
      driver_fee: 40,
      created_at: new Date(),
      updated_at: new Date(),
      orderDishes: [
        {
          order_id: 1,
          dish_id: 1,
          amount: 2,
          remark: null,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          order_id: 1,
          dish_id: 2,
          amount: 1,
          remark: null,
          created_at: new Date(),
          updated_at: new Date()
        }
      ]
    };

    beforeEach(() => {
      // Mock restaurant and dish validations
      (prisma.restaurant.findUnique as jest.Mock).mockResolvedValue(mockRestaurant);
      (prisma.dish.findMany as jest.Mock).mockResolvedValue(mockDishDetails);
    });

    it('should create order successfully', async () => {
      // Mock the createOrder method to return a fully typed Order with orderDishes
      mockCustomerRepository.createOrder.mockResolvedValue(mockOrder);

      const result = await customerService.createOrder(1, validOrderData);
      
      expect(result).toEqual(mockOrder);
      expect(mockCustomerRepository.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: 1,
          restaurant_id: 1,
          location: '123 Test Street',
          total_amount: 400,
          driver_fee: 40
        })
      );
    });

    // ... rest of the tests remain the same
  });
});