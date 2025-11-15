import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { OrderStatus } from '@/generated/prisma/enums';
import { RestaurantController } from '@/controllers/restaurant.controller';
import RestaurantService from '@/services/restaurant.service';
import { AppError } from '@/types/error';
import { IJwtData } from '@/types/auth/jwt';

interface AuthenticatedRequest extends Request {
  user?: IJwtData;
}

jest.mock('@/services/restaurant.service');

describe('RestaurantController', () => {
  let restaurantController: RestaurantController;
  let mockRestaurantService: jest.Mocked<RestaurantService>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockRestaurantService = new RestaurantService() as jest.Mocked<RestaurantService>;
    restaurantController = new RestaurantController();
    (restaurantController as any).restaurantService = mockRestaurantService;

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
  });

  const createMockOrder = (status: OrderStatus) => ({
    id: 1,
    customer_id: 1,
    driver_id: null,
    restaurant_id: 1, // ADD THIS LINE
    location: "123 Test St",
    status: status,
    remark: null,
    total_amount: 25.99,
    driver_fee: 5,
    created_at: new Date(),
    updated_at: new Date(),
    customer: {
      id: 1,
      image: null,
      tel: "1234567890",
      created_at: new Date(),
      updated_at: new Date(),
      firstname: "John",
      lastname: "Doe"
    },
    driver: null,
    orderDishes: [],
    payments: []
  });

  describe('getRestaurantOrders', () => {
    it('should return orders for authenticated user', async () => {
      const mockOrders = [createMockOrder(OrderStatus.pending)];
      mockRequest = {
        user: { id: 1, email: 'test@example.com', role: 'restaurant_owner' },
        query: {},
      };
      mockRestaurantService.getRestaurantOrders.mockResolvedValue(mockOrders);

      await restaurantController.getRestaurantOrders(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockRestaurantService.getRestaurantOrders).toHaveBeenCalledWith(1, undefined);
      expect(mockStatus).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockJson).toHaveBeenCalledWith(mockOrders);
    });

    // ... other test cases ...
  });

  describe('updateOrderStatus', () => {
    it('should update order status for valid request', async () => {
      const mockUpdatedOrder = createMockOrder(OrderStatus.preparing);
      mockRequest = {
        user: { id: 1, email: 'test@example.com', role: 'restaurant_owner' },
        params: { orderId: '1' },
        body: { status: OrderStatus.preparing },
      };
      mockRestaurantService.updateOrderStatus.mockResolvedValue(mockUpdatedOrder);

      await restaurantController.updateOrderStatus(mockRequest as AuthenticatedRequest, mockResponse as Response);

      expect(mockRestaurantService.updateOrderStatus).toHaveBeenCalledWith(1, 1, OrderStatus.preparing);
      expect(mockStatus).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedOrder);
    });

    // ... other test cases ...
  });
});