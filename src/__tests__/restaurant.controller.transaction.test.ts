import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RestaurantController } from '@/controllers/restaurant.controller';
import RestaurantService from '@/services/restaurant.service';
import { AppError } from '@/types/error';
import { OrderStatus, VerificationStatus } from '@/generated/prisma/enums';

// Mock the RestaurantService
jest.mock('@/services/restaurant.service');

describe('RestaurantController', () => {
  let restaurantController: RestaurantController;
  let mockRestaurantService: jest.Mocked<RestaurantService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;

  beforeEach(() => {
    mockRestaurantService = new RestaurantService() as jest.Mocked<RestaurantService>;
    restaurantController = new RestaurantController();
    (restaurantController as any).restaurantService = mockRestaurantService;

    mockJson = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: mockJson,
    };
  });

  describe('getRestaurantTransactions', () => {
    it('should return transactions successfully', async () => {
      const mockTransactions = [
        {
          id: 1,
          status: OrderStatus.success,
          totalAmount: 100,
          driverFee: 10,
          createdAt: new Date('2023-05-01'),
          dishes: [
            { name: 'Dish 1', amount: 2, price: 50 },
          ],
          payments: [
            { id: 1, status: VerificationStatus.approved, createdAt: new Date('2023-05-01') },
          ],
        },
      ];
      mockRestaurantService.getRestaurantTransactions.mockResolvedValue(mockTransactions);

      mockRequest = {
        params: { id: '1' },
        query: {},
      };

      await restaurantController.getRestaurantTransactions(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockJson).toHaveBeenCalledWith(mockTransactions);
      expect(mockRestaurantService.getRestaurantTransactions).toHaveBeenCalledWith(1, undefined, undefined);
    });

    it('should handle date range filters', async () => {
      mockRestaurantService.getRestaurantTransactions.mockResolvedValue([]);

      mockRequest = {
        params: { id: '1' },
        query: { startDate: '2023-05-01', endDate: '2023-05-31' },
      };

      await restaurantController.getRestaurantTransactions(mockRequest as Request, mockResponse as Response);

      expect(mockRestaurantService.getRestaurantTransactions).toHaveBeenCalledWith(1, '2023-05-01', '2023-05-31');
    });

    it('should handle AppError', async () => {
      const errorMessage = 'Invalid restaurant ID';
      mockRestaurantService.getRestaurantTransactions.mockRejectedValue(new AppError(errorMessage, StatusCodes.BAD_REQUEST));

      mockRequest = {
        params: { id: 'invalid' },
        query: {},
      };

      await restaurantController.getRestaurantTransactions(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({ message: errorMessage });
    });

    it('should handle unexpected errors', async () => {
      mockRestaurantService.getRestaurantTransactions.mockRejectedValue(new Error('Unexpected error'));

      mockRequest = {
        params: { id: '1' },
        query: {},
      };

      await restaurantController.getRestaurantTransactions(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});