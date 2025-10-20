import { Request, Response } from 'express';
import { CustomerController } from '@/controllers/customer.controller';
import CustomerService from '@/services/customer.service';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/types/error';
import { OrderStatus } from '@/generated/prisma/client';
import { IJwtData } from '@/types/auth/jwt';

// Add this custom interface
interface CustomRequest extends Request {
  user?: IJwtData;
}

// Mock the CustomerService
jest.mock('@/services/customer.service');

describe('CustomerController', () => {
  let controller: CustomerController;
  let mockService: jest.Mocked<CustomerService>;
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;

  beforeEach(() => {
    // Create a mock implementation of CustomerService
    mockService = {
      getOrderStatus: jest.fn(),
      getAllOrdersWithStatus: jest.fn(),
      processMockPayment: jest.fn(),
      getCustomerProfile: jest.fn(),
      updateCustomerProfile: jest.fn(),
    } as any;

    // Create the controller and inject the mock service
    controller = new CustomerController();
    (controller as any).customerService = mockService;

    // Setup mock request object with a complete IJwtData object
    req = {
      user: { 
        id: 1,
        email: 'test@example.com',
        role: 'customer',
      },
      params: {},
      query: {},
      body: {},
    };

    // Setup mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrderStatus', () => {
    it('should successfully return order status for a valid order', async () => {
      // Arrange
      const mockOrderStatus = {
        orderId: 1,
        currentStatus: OrderStatus.delivered,
        statusDescription: 'Order has been delivered',
        restaurantName: 'Test Restaurant',
        orderDate: new Date(),
        lastUpdatedAt: new Date(),
        totalAmount: 500,
        items: [{ name: 'Pizza', quantity: 1, price: 500 }],
        trackingInfo: undefined,
      };

      req.params = { orderId: '1' };
      (mockService.getOrderStatus as jest.Mock).mockResolvedValue(mockOrderStatus);

      // Act
      await controller.getOrderStatus(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrderStatus
      });
      expect(mockService.getOrderStatus).toHaveBeenCalledWith(1, 1);
    });

    it('should handle invalid order ID', async () => {
      // Arrange
      req.params = { orderId: 'invalid' };

      // Act
      await controller.getOrderStatus(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Invalid order ID" 
      });
    });

    it('should handle service layer error', async () => {
      // Arrange
      req.params = { orderId: '1' };
      const appError = new AppError('Order not found', StatusCodes.NOT_FOUND);
      (mockService.getOrderStatus as jest.Mock).mockRejectedValue(appError);

      // Act
      await controller.getOrderStatus(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Order not found" 
      });
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      req.params = { orderId: '1' };
      const unexpectedError = new Error('Unexpected error');
      (mockService.getOrderStatus as jest.Mock).mockRejectedValue(unexpectedError);

      // Act
      await controller.getOrderStatus(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Internal Server Error" 
      });
    });
  });

  describe('getAllOrdersWithStatus', () => {
    it('should return all orders with optional status filter', async () => {
      // Arrange
      const mockOrders = [
        {
          orderId: 1,
          currentStatus: OrderStatus.pending,
          statusDescription: 'Waiting for payment',
          restaurantName: 'Test Restaurant',
          totalAmount: 500,
          orderDate: new Date(),
          lastUpdatedAt: new Date(),
          estimatedDeliveryTime: undefined,
          itemCount: 2,
        }
      ];

      req.query = { status: 'pending' };
      (mockService.getAllOrdersWithStatus as jest.Mock).mockResolvedValue(mockOrders);

      // Act
      await controller.getAllOrdersWithStatus(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders
      });
      expect(mockService.getAllOrdersWithStatus).toHaveBeenCalledWith(1, 'pending');
    });

    it('should return all orders without status filter', async () => {
      // Arrange
      const mockOrders = [
        {
          orderId: 1,
          currentStatus: OrderStatus.pending,
          statusDescription: 'Waiting for payment',
          restaurantName: 'Test Restaurant',
          totalAmount: 500,
          orderDate: new Date(),
          lastUpdatedAt: new Date(),
          estimatedDeliveryTime: undefined,
          itemCount: 2,
        }
      ];

      req.query = {};
      (mockService.getAllOrdersWithStatus as jest.Mock).mockResolvedValue(mockOrders);

      // Act
      await controller.getAllOrdersWithStatus(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders
      });
      expect(mockService.getAllOrdersWithStatus).toHaveBeenCalledWith(1, undefined);
    });

    it('should handle service layer error', async () => {
      // Arrange
      const appError = new AppError('Error fetching orders', StatusCodes.INTERNAL_SERVER_ERROR);
      (mockService.getAllOrdersWithStatus as jest.Mock).mockRejectedValue(appError);

      // Act
      await controller.getAllOrdersWithStatus(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Error fetching orders" 
      });
    });
  });

  describe('processMockPayment', () => {
    it('should process mock payment successfully', async () => {
      // Arrange
      req.body = {
        orderId: 1,
        amount: 500,
        paymentMethod: 'credit_card'
      };

      const mockPaymentResult = {
        success: true,
        transactionId: 'TXN_123',
        message: 'Payment processed successfully',
        orderId: 1,
        newOrderStatus: OrderStatus.success,
        timestamp: new Date(),
      };

      (mockService.processMockPayment as jest.Mock).mockResolvedValue(mockPaymentResult);

      // Act
      await controller.processMockPayment(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        success: mockPaymentResult.success,
        data: mockPaymentResult
      });
      expect(mockService.processMockPayment).toHaveBeenCalledWith(1, 1, {
        amount: 500,
        paymentMethod: 'credit_card'
      });
    });

    it('should handle missing payment details', async () => {
      // Arrange
      req.body = {}; // Missing orderId and amount

      // Act
      await controller.processMockPayment(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Order ID and amount are required" 
      });
    });

    it('should handle service layer error', async () => {
      // Arrange
      req.body = {
        orderId: 1,
        amount: 500
      };
      const appError = new AppError('Payment failed', StatusCodes.BAD_REQUEST);
      (mockService.processMockPayment as jest.Mock).mockRejectedValue(appError);

      // Act
      await controller.processMockPayment(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Payment failed" 
      });
    });

    it('should handle unexpected errors', async () => {
      // Arrange
      req.body = {
        orderId: 1,
        amount: 500
      };
      const unexpectedError = new Error('Unexpected error');
      (mockService.processMockPayment as jest.Mock).mockRejectedValue(unexpectedError);

      // Act
      await controller.processMockPayment(req as CustomRequest, res as Response);

      // Assert
      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Internal Server Error" 
      });
    });
  });
});