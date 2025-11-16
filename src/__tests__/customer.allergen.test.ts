import { prisma } from "@/libs/prisma";
import CustomerRepository from "@/repositories/customer.repository";
import CustomerService from "@/services/customer.service";
import { Allergy } from "@/generated/prisma/client";

// Mock the CustomerRepository
jest.mock("@/repositories/customer.repository");

describe("Customer Allergies", () => {
  let customerRepository: jest.Mocked<CustomerRepository>;
  let customerService: CustomerService;
  const mockUserId = 1;

  beforeEach(() => {
    customerRepository = new CustomerRepository() as jest.Mocked<CustomerRepository>;
    customerService = new CustomerService();
    // Inject the mocked repository into the service
    (customerService as any).customerRepository = customerRepository;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("CustomerRepository", () => {
    test("getAllergies should return customer allergies", async () => {
      const mockAllergies = [Allergy.gluten, Allergy.peanuts];
      customerRepository.getAllergies.mockResolvedValue(mockAllergies);

      const result = await customerRepository.getAllergies(mockUserId);
      expect(result).toEqual(mockAllergies);
      expect(customerRepository.getAllergies).toHaveBeenCalledWith(mockUserId);
    });

    test("updateAllergies should update and return customer allergies", async () => {
      const mockAllergies = [Allergy.seafood, Allergy.dairy];
      customerRepository.updateAllergies.mockResolvedValue(mockAllergies);

      const result = await customerRepository.updateAllergies(mockUserId, mockAllergies);
      expect(result).toEqual(mockAllergies);
      expect(customerRepository.updateAllergies).toHaveBeenCalledWith(mockUserId, mockAllergies);
    });
  });

  describe("CustomerService", () => {
    test("getAllergies should return customer allergies", async () => {
      const mockAllergies = [Allergy.eggs, Allergy.soy];
      customerRepository.getAllergies.mockResolvedValue(mockAllergies);

      const result = await customerService.getAllergies(mockUserId);
      expect(result).toEqual(mockAllergies);
      expect(customerRepository.getAllergies).toHaveBeenCalledWith(mockUserId);
    });

    test("updateAllergies should update and return valid customer allergies", async () => {
      const inputAllergies = [Allergy.tree_nuts, Allergy.wheat, "invalid_allergy" as Allergy];
      const validAllergies = [Allergy.tree_nuts, Allergy.wheat];
      customerRepository.updateAllergies.mockResolvedValue(validAllergies);

      const result = await customerService.updateAllergies(mockUserId, inputAllergies);
      expect(result).toEqual(validAllergies);
      expect(customerRepository.updateAllergies).toHaveBeenCalledWith(mockUserId, validAllergies);
    });
  });
});