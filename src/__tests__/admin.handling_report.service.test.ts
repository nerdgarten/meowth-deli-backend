import AdminService from '@/services/admin.service';
import AdminRepository from '@/repositories/admin.repository';

jest.mock('@/repositories/admin.repository');

describe('AdminService', () => {
  let adminService: AdminService;
  let mockAdminRepository: jest.Mocked<AdminRepository>;

  beforeEach(() => {
    mockAdminRepository = new AdminRepository() as jest.Mocked<AdminRepository>;
    adminService = new AdminService();
    (adminService as any).adminRepository = mockAdminRepository;
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
      mockAdminRepository.listRestaurantReviews.mockResolvedValue(mockReviews);

      const result = await adminService.listRestaurantReviews();

      expect(result).toEqual(mockReviews);
      expect(mockAdminRepository.listRestaurantReviews).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteRestaurantReview', () => {
    it('should delete a restaurant review', async () => {
      const reviewId = 1;
      const deletedReview = {
        id: reviewId,
        user_id: 1,
        restaurant_id: 1,
        order_id: 1,
        rate: 5,
        review_text: 'Great!',
        created_at: new Date(),
        updated_at: new Date()
      };
      mockAdminRepository.deleteRestaurantReview.mockResolvedValue(deletedReview);

      const result = await adminService.deleteRestaurantReview(reviewId);

      expect(result).toEqual({
        success: true,
        message: "Restaurant review deleted successfully",
      });
      expect(mockAdminRepository.deleteRestaurantReview).toHaveBeenCalledWith(reviewId);
    });
  });
});