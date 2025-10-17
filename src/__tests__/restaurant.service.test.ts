import { OrderStatus, VerificationStatus } from '@/generated/prisma/client';
import RestaurantService from '@/services/restaurant.service';
import RestaurantRepository from '@/repositories/restaurant.repository';
import { AppError } from '@/types/error';
import { restaurantOwnershipValidator } from '@/utils/restaurantOwnershipValidator';

jest.mock('@/repositories/restaurant.repository');
jest.mock('@/utils/restaurantOwnershipValidator');

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  let mockRestaurantRepository: jest.Mocked<RestaurantRepository>;

  beforeEach(() => {
    mockRestaurantRepository = new RestaurantRepository() as jest.Mocked<RestaurantRepository>;
    restaurantService = new RestaurantService();
    (restaurantService as any).restaurantRepository = mockRestaurantRepository;
  });

  const createMockOrder = (status: OrderStatus) => ({
    id: 1,
    customer_id: 1,
    driver_id: null,
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
    orderDishes: [{
      order_id: 1,
      dish_id: 1,
      amount: 2,
      remark: null,
      created_at: new Date(),
      updated_at: new Date(),
      dish: {
        id: 1,
        name: "Test Dish",
        detail: "A test dish",
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 1,
        allergy: null,
        price: 12.99,
        is_out_of_stock: false
      }
    }],
    payments: []
  });

  describe('getRestaurantOrders', () => {
    it('should return orders for a valid restaurant owner', async () => {
      const userId = 1;
      const restaurantId = 1;
      const mockOrders = [createMockOrder(OrderStatus.pending)];

      (restaurantOwnershipValidator.validateUserIsRestaurantOwner as jest.Mock).mockResolvedValue({ id: restaurantId });
      mockRestaurantRepository.getOrdersByRestaurantId.mockResolvedValue(mockOrders);

      const result = await restaurantService.getRestaurantOrders(userId);

      expect(result).toEqual(mockOrders);
      expect(restaurantOwnershipValidator.validateUserIsRestaurantOwner).toHaveBeenCalledWith(userId);
      expect(mockRestaurantRepository.getOrdersByRestaurantId).toHaveBeenCalledWith(restaurantId, undefined);
    });

    it('should filter orders by status when provided', async () => {
      const userId = 1;
      const restaurantId = 1;
      const status = OrderStatus.pending;
      const mockOrders = [createMockOrder(OrderStatus.pending)];

      (restaurantOwnershipValidator.validateUserIsRestaurantOwner as jest.Mock).mockResolvedValue({ id: restaurantId });
      mockRestaurantRepository.getOrdersByRestaurantId.mockResolvedValue(mockOrders);

      const result = await restaurantService.getRestaurantOrders(userId, status);

      expect(result).toEqual(mockOrders);
      expect(mockRestaurantRepository.getOrdersByRestaurantId).toHaveBeenCalledWith(restaurantId, status);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status for a valid request', async () => {
      const userId = 1;
      const orderId = 1;
      const newStatus = OrderStatus.preparing;
      const restaurantId = 1;
      const mockOrder = createMockOrder(OrderStatus.pending);
      const mockUpdatedOrder = createMockOrder(OrderStatus.preparing);

      (restaurantOwnershipValidator.validateUserIsRestaurantOwner as jest.Mock).mockResolvedValue({ id: restaurantId });
      mockRestaurantRepository.findOrderById.mockResolvedValue(mockOrder);
      mockRestaurantRepository.updateOrderStatus.mockResolvedValue(mockUpdatedOrder);

      const result = await restaurantService.updateOrderStatus(userId, orderId, newStatus);

      expect(result).toEqual(mockUpdatedOrder);
      expect(restaurantOwnershipValidator.validateUserIsRestaurantOwner).toHaveBeenCalledWith(userId);
      expect(mockRestaurantRepository.findOrderById).toHaveBeenCalledWith(orderId);
      expect(mockRestaurantRepository.updateOrderStatus).toHaveBeenCalledWith(orderId, newStatus);
    });

    it('should throw an error for an invalid status update', async () => {
      const userId = 1;
      const orderId = 1;
      const newStatus = OrderStatus.delivered as any; // This should not be allowed
      const restaurantId = 1;
      const mockOrder = createMockOrder(OrderStatus.pending);

      (restaurantOwnershipValidator.validateUserIsRestaurantOwner as jest.Mock).mockResolvedValue({ id: restaurantId });
      mockRestaurantRepository.findOrderById.mockResolvedValue(mockOrder);

      await expect(restaurantService.updateOrderStatus(userId, orderId, newStatus))
        .rejects.toThrow(AppError);
    });

    it('should throw an error if the order is not in pending state', async () => {
      const userId = 1;
      const orderId = 1;
      const newStatus = OrderStatus.preparing;
      const restaurantId = 1;
      const mockOrder = createMockOrder(OrderStatus.delivered);

      (restaurantOwnershipValidator.validateUserIsRestaurantOwner as jest.Mock).mockResolvedValue({ id: restaurantId });
      mockRestaurantRepository.findOrderById.mockResolvedValue(mockOrder);

      await expect(restaurantService.updateOrderStatus(userId, orderId, newStatus))
        .rejects.toThrow(AppError);
    });
  });
});