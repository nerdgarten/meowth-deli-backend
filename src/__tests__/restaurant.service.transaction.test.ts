import { StatusCodes } from 'http-status-codes';
import RestaurantService from '@/services/restaurant.service';
import RestaurantRepository from '@/repositories/restaurant.repository';
import { AppError } from '@/types/error';
import { OrderStatus, VerificationStatus } from '@/generated/prisma/enums';

// Mock the RestaurantRepository
jest.mock('@/repositories/restaurant.repository');

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  let mockRestaurantRepository: jest.Mocked<RestaurantRepository>;

  beforeEach(() => {
    mockRestaurantRepository = new RestaurantRepository() as jest.Mocked<RestaurantRepository>;
    restaurantService = new RestaurantService();
    (restaurantService as any).restaurantRepository = mockRestaurantRepository;
  });

  describe('getRestaurantTransactions', () => {
    it('should throw an error for invalid restaurant ID', async () => {
      await expect(restaurantService.getRestaurantTransactions(NaN))
        .rejects.toThrow(new AppError('Invalid restaurant ID', StatusCodes.BAD_REQUEST));
    });

    it('should return formatted transactions', async () => {
      const mockTransactions = [
        {
          id: 1,
          status: OrderStatus.success,
          total_amount: 100,
          driver_fee: 10,
          created_at: new Date('2023-05-01'),
          updated_at: new Date('2023-05-01'),
          customer_id: 1,
          driver_id: 1,
          restaurant_id: 1,
          location: 'Test Location',
          remark: 'Test Remark',
          orderDishes: [
            {
              order_id: 1,
              dish_id: 1,
              amount: 2,
              remark: 'No onions',
              created_at: new Date('2023-05-01'),
              updated_at: new Date('2023-05-01'),
              dish: {
                id: 1,
                name: 'Dish 1',
                detail: 'Delicious dish',
                created_at: new Date('2023-05-01'),
                updated_at: new Date('2023-05-01'),
                restaurant_id: 1,
                allergy: null,
                price: 50,
                is_out_of_stock: false,
              },
            },
          ],
          payments: [
            {
              id: 1,
              order_id: 1,
              payment_method_id: 1,
              image: 'payment.jpg',
              status: VerificationStatus.approved,
              created_at: new Date('2023-05-01'),
              updated_at: new Date('2023-05-01'),
            },
          ],
        },
      ];

      mockRestaurantRepository.findTransactionsByRestaurantId.mockResolvedValue(mockTransactions);

      const result = await restaurantService.getRestaurantTransactions(1);

      expect(result).toEqual([
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
      ]);

      expect(mockRestaurantRepository.findTransactionsByRestaurantId).toHaveBeenCalledWith(1, undefined, undefined);
    });

    it('should handle date filters correctly', async () => {
      mockRestaurantRepository.findTransactionsByRestaurantId.mockResolvedValue([]);

      await restaurantService.getRestaurantTransactions(1, '2023-05-01', '2023-05-31');

      expect(mockRestaurantRepository.findTransactionsByRestaurantId).toHaveBeenCalledWith(
        1,
        new Date('2023-05-01'),
        new Date('2023-05-31')
      );
    });
  });
});