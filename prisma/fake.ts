import { PrismaClient } from "../src/generated/prisma/client";
import { fakeUser, fakeRestaurant, fakeDish } from "./fake-data";

const prisma = new PrismaClient();

async function main() {

  for (let i = 0; i < 5; i++) {
    const userData = fakeUser();
    const restaurantData = fakeRestaurant();
    const restaurant = await prisma.user.create({
      data: {
        ...userData,
        roles: { create: { role: "restaurant" } },
        restaurant: { create: restaurantData },
      },
      include: {
        roles: true,
        restaurant: true,
      },
    });
    // Create 10 fake dishes for each restaurant
    for (let j = 0; j < 10; j++) {
      const dishData = fakeDish();
      await prisma.dish.create({
        data: { ...dishData, restaurant_id: restaurant.id },
      });
    }
  }
}
main()
    .then(async () => {
        console.log("Seeding finished.");
    })    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });