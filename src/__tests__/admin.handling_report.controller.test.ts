import { Request, Response } from 'express';
import { AdminController } from '@/controllers/admin.controller';
import AdminService from '@/services/admin.service';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@/types/error';

jest.mock('@/services/admin.service');

describe('AdminController', () => {
  let adminController: AdminController;
  let mockAdminService: jest.Mocked<AdminService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockAdminService = new AdminService() as jest.Mocked<AdminService>;
    adminController = new AdminController();
    (adminController as any).adminService = mockAdminService;

    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('listRestaurantReviews', () => {
    it('should return a list of restaurant reviews', async () => {
      const mockReviews = [
        {
          id: 1,
          user_id: 1,
          restaurant_id: 1,
          order_id: 1,
          rate: 5,
          review_text: 'Great!',
          created_at: new Date(),
          updated_at: new Date(),
          user: { id: 1, email: 'user1@example.com' },
          restaurant: { id: 1, name: 'Restaurant 1' }
        },
        {
          id: 2,
          user_id: 2,
          restaurant_id: 1,
          order_id: 2,
          rate: 4,
          review_text: 'Good',
          created_at: new Date(),
          updated_at: new Date(),
          user: { id: 2, email: 'user2@example.com' },
          restaurant: { id: 1, name: 'Restaurant 1' }
        },
      ];
      mockAdminService.listRestaurantReviews.mockResolvedValue(mockReviews);

      await adminController.listRestaurantReviews(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith(mockReviews);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      mockAdminService.listRestaurantReviews.mockRejectedValue(error);

      await adminController.listRestaurantReviews(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });
  });

  describe('deleteRestaurantReview', () => {
    it('should delete a restaurant review', async () => {
      const reviewId = '1';
      mockRequest.params = { id: reviewId };
      mockAdminService.deleteRestaurantReview.mockResolvedValue({
        success: true,
        message: 'Restaurant review deleted successfully',
      });

      await adminController.deleteRestaurantReview(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Restaurant review deleted successfully',
      });
    });

    it('should handle errors', async () => {
      const reviewId = '1';
      mockRequest.params = { id: reviewId };
      const error = new AppError('Test error', StatusCodes.NOT_FOUND);
      mockAdminService.deleteRestaurantReview.mockRejectedValue(error);

      await adminController.deleteRestaurantReview(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Test error',
      });
    });
  });
});