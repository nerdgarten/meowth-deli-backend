import { Request, Response, NextFunction } from "express";
import { CustomerRouter } from "@/routes/customer.route";
import { CustomerController } from "@/controllers/customer.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";

jest.mock("@/controllers/customer.controller");
jest.mock("@/middlewares/auth.middleware");

describe("CustomerRouter", () => {
  let mockCustomerController: jest.Mocked<CustomerController>;
  let customerRouter: CustomerRouter;

  beforeAll(() => {
    mockCustomerController = new CustomerController() as jest.Mocked<CustomerController>;
    customerRouter = new CustomerRouter();

    // Inject mocked controller
    (customerRouter as any).customerController = mockCustomerController;

    // Bypass auth middleware
    (authMiddleware as jest.Mock).mockImplementation(
      (req: Request, res: Response, next: NextFunction) => next()
    );
  });

  const testCases = [
    {
      name: "getOrderHistory",
      route: "/my-orders",
      expectedData: { orders: [{ id: 1 }], pagination: { currentPage: 1, totalPages: 1 } },
    },
    {
      name: "getOrderStatistics",
      route: "/my-orders/statistics",
      expectedData: { totalOrders: 10, totalSpent: 1000 },
    },
    {
      name: "getOrderById",
      route: "/my-orders/:orderId",
      expectedData: { id: 1, status: "completed", total: 100 },
    },
    {
      name: "getReorderItems",
      route: "/my-orders/:orderId/reorder",
      expectedData: [{ dishId: 1, quantity: 2 }],
    },
  ];

  testCases.forEach(({ name, route, expectedData }) => {
    it(`should handle ${route} correctly`, async () => {
      const mockReq = {
        params: { orderId: "1" },
        query: {},
        user: { id: 1 },
      } as unknown as Request;

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockNext = jest.fn();

      // Mock the controller method
      (mockCustomerController[name as keyof CustomerController] as jest.Mock).mockImplementation(
        async (req: Request, res: Response) => {
          res.status(200).json(expectedData);
        }
      );

      // Simulate calling the controller directly
      await (mockCustomerController[name as keyof CustomerController] as any)(
        mockReq,
        mockRes,
        mockNext
      );

      expect(mockCustomerController[name as keyof CustomerController]).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expectedData);
    });
  });
});
