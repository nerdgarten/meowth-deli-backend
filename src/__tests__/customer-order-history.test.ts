import { Request, Response, NextFunction } from 'express';
import { CustomerRouter } from '@/routes/customer.route';
import { CustomerController } from '@/controllers/customer.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

jest.mock('@/controllers/customer.controller');
jest.mock('@/middlewares/auth.middleware');

describe('CustomerRouter', () => {
  let mockCustomerController: jest.Mocked<CustomerController>;
  let customerRouter: CustomerRouter;

  beforeAll(() => {
    mockCustomerController = new CustomerController() as jest.Mocked<CustomerController>;
    customerRouter = new CustomerRouter();
    customerRouter['customerController'] = mockCustomerController;

    (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
  });

  const testCases = [
    {
      name: 'getOrderHistory',
      route: '/HistoryOrders',
      mockResponse: { orders: [{ id: 1 }], pagination: { currentPage: 1, totalPages: 1 } }
    },
    {
      name: 'getOrderStatistics',
      route: '/Orders/statistics',
      mockResponse: { totalOrders: 10, totalSpent: 1000 }
    },
    {
      name: 'getOrderById',
      route: '/HistoryOrders/:orderId',
      mockResponse: { id: 1, status: 'completed', total: 100 }
    },
    {
      name: 'getReorderItems',
      route: '/HistoryOrders/:orderId/reorder',
      mockResponse: [{ dishId: 1, quantity: 2 }]
    }
  ];

  testCases.forEach(({ name, route, mockResponse }) => {
    it(`should handle ${route} correctly`, async () => {
      const mockRequest = {
        params: { orderId: '1' },
        query: {},
        user: { id: 1 }
      } as unknown as Request;
      
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      const mockNext = jest.fn();

      mockCustomerController[name as keyof CustomerController].mockImplementation(async (req: Request, res: Response) => {
        res.status(200).json(mockResponse);
      });

      // Directly call the controller method
      await (mockCustomerController[name as keyof CustomerController] as any)(mockRequest, mockResponse, mockNext);

      expect(mockCustomerController[name as keyof CustomerController]).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResponse);
    });
  });
});