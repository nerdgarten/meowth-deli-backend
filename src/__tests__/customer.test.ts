import { prisma } from "@/libs/prisma";
import CustomerService from "@/services/customer.service";
import { AppError } from "@/types/error";
import { Prisma } from "@/generated/prisma/client";

describe('CustomerService - Order Creation', () => {
  let customerService: CustomerService;

  beforeEach(() => {
    customerService = new CustomerService();
  });

  afterEach(async () => {
    await prisma.orderDish.deleteMany();
    await prisma.order.deleteMany();
    await prisma.dish.deleteMany();
    await prisma.restaurant.deleteMany();
    await prisma.customer.deleteMany();
  });

  describe('createOrder', () => {
    it('should create an order with valid dishes', async () => {
      // Arrange
      const restaurant = await prisma.restaurant.create({
        data: {
          name: 'Test Restaurant',
          tel: '1234567890',
          location: 'Test Location',
          user: {
            connect: { id: 1 }
          }
        }
      });

      const dish = await prisma.dish.create({
        data: {
          name: 'Pad Thai',
          price: 150,
          restaurant_id: restaurant.id,
          is_out_of_stock: false
        }
      });

      const orderData = {
        location: '123 Test Street',
        note: 'Test note',
        dishes: [{
          name: 'Pad Thai',
          quantity: 2,
          note: 'Spicy'
        }]
      };

      // Act
      const result = await customerService.createOrder(1, orderData);

      // Assert
      expect(result).toBeDefined();
      expect(result.location).toBe(orderData.location);
      expect(result.remark).toBe(orderData.note);
      expect(result.status).toBe('pending');
    });

    it('should throw error when dish not found', async () => {
      // Arrange
      const orderData = {
        location: '123 Test Street',
        dishes: [{
          name: 'Non-existent Dish',
          quantity: 1
        }]
      };

      // Act & Assert
      await expect(customerService.createOrder(1, orderData))
        .rejects
        .toThrow('Dishes not found: Non-existent Dish');
    });

    it('should throw error when dishes from different restaurants', async () => {
      // Arrange
      const restaurant1 = await prisma.restaurant.create({
        data: {
          name: 'Restaurant 1',
          tel: '1234567890',
          location: 'Location 1',
          user: {
            connect: { id: 1 }
          }
        }
      });

      const restaurant2 = await prisma.restaurant.create({
        data: {
          name: 'Restaurant 2',
          tel: '0987654321',
          location: 'Location 2',
          user: {
            connect: { id: 2 }
          }
        }
      });

      await prisma.dish.createMany({
        data: [
          {
            name: 'Dish 1',
            price: 100,
            restaurant_id: restaurant1.id,
            is_out_of_stock: false
          },
          {
            name: 'Dish 2',
            price: 150,
            restaurant_id: restaurant2.id,
            is_out_of_stock: false
          }
        ]
      });

      const orderData = {
        location: '123 Test Street',
        dishes: [
          { name: 'Dish 1', quantity: 1 },
          { name: 'Dish 2', quantity: 1 }
        ]
      };

      // Act & Assert
      await expect(customerService.createOrder(1, orderData))
        .rejects
        .toThrow('All dishes must be from the same restaurant');
    });
  });
});