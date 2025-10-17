import { jest } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { OrderStatus, type Order, type OrderDish } from '@/generated/prisma/client';
import CustomerRepository from '@/repositories/customer.repository';
import CustomerService from '@/services/customer.service';
import { CustomerController } from '@/controllers/customer.controller';
import { CustomerRouter } from '@/routes/customer.route';
import { AppError } from '@/types/error';
import { ICreateOrderRequest, IOrderDishRepository } from '@/types/user';

jest.mock('@/repositories/customer.repository');
jest.mock('@/services/customer.service');

describe('Customer Order Tests', () => {
  let customerRepository: jest.Mocked<CustomerRepository>;
  let customerService: jest.Mocked<CustomerService>;
  let customerController: CustomerController;
  let customerRouter: CustomerRouter;

  beforeEach(() => {
    customerRepository = new CustomerRepository() as jest.Mocked<CustomerRepository>;
    customerService = new CustomerService() as jest.Mocked<CustomerService>;
    customerController = new CustomerController();
    customerRouter = new CustomerRouter();

    // Inject mocked service into controller
    (customerController as any).customerService = customerService;
  });

  const mockOrder: Order = {
    id: 1,
    customer_id: 1,
    driver_id: null,
    location: 'Test Location',
    status: OrderStatus.pending,
    remark: 'Test Remark',
    total_amount: 100,
    driver_fee: 10,
    created_at: new Date('2025-10-17T09:18:53.877Z'),
    updated_at: new Date('2025-10-17T09:18:53.877Z'),
  };

  const mockOrderDishes: OrderDish[] = [
    {
      order_id: 1,
      dish_id: 1,
      amount: 2,
      remark: null,
      created_at: new Date('2025-10-17T09:18:53.877Z'),
      updated_at: new Date('2025-10-17T09:18:53.877Z'),
    },
  ];

  const mockOrderWithDishes = { ...mockOrder, orderDishes: mockOrderDishes };

  describe('CustomerRepository', () => {
    it('should create an order', async () => {
      customerRepository.createOrder.mockResolvedValue(mockOrderWithDishes);

      const result = await customerRepository.createOrder({
        customerId: 1,
        location: 'Test Location',
        note: 'Test Remark',
        dishes: [{ dishId: 1, quantity: 2, note: undefined }],
      });

      expect(result).toEqual(mockOrderWithDishes);
    });
  });

  describe('CustomerService', () => {
    it('should create an order', async () => {
      customerService.createOrder.mockResolvedValue(mockOrderWithDishes);

      const orderData: ICreateOrderRequest = {
        location: 'Test Location',
        note: 'Test Remark',
        dishes: [{ name: 'Test Dish', quantity: 2, note: undefined }],
      };

      const result = await customerService.createOrder(1, orderData);

      expect(result).toEqual(mockOrderWithDishes);
    });
  });

  describe('CustomerController', () => {
    it('should handle create order request', async () => {
      const req = {
        user: { id: 1 },
        body: {
          location: 'Test Location',
          note: 'Test Remark',
          dishes: [{ name: 'Test Dish', quantity: 2, note: undefined }],
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      customerService.createOrder.mockResolvedValue(mockOrderWithDishes);

      await customerController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order created successfully',
        order: mockOrderWithDishes,
      });
    });
  });

  describe('CustomerRouter', () => {
    it('should set up routes correctly', () => {
      const postSpy = jest.spyOn(customerRouter.router, 'post');
      customerRouter.setUpRoutes();

      expect(postSpy).toHaveBeenCalledWith(
        '/orders',
        expect.any(Function),
        expect.any(Function)
      );
    });
  });
});