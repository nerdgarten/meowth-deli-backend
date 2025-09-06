-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('customer', 'driver', 'restaurant', 'admin');

-- CreateEnum
CREATE TYPE "public"."WeekDay" AS ENUM ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('pending', 'preparing', 'delivered', 'rejected', 'success');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('cash', 'mobilebanking', 'creditcard');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('pending', 'rejected', 'success');

-- CreateEnum
CREATE TYPE "public"."CouponType" AS ENUM ('percent', 'fixed');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accepted_term_of_service" BOOLEAN NOT NULL DEFAULT false,
    "accepted_pdpa" BOOLEAN NOT NULL DEFAULT false,
    "accpeted_cookie_tracking" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRole" (
    "user_id" INTEGER NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'customer',

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("user_id","role")
);

-- CreateTable
CREATE TABLE "public"."Customer" (
    "id" INTEGER NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT,
    "image" TEXT,
    "tel" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Driver" (
    "id" INTEGER NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT,
    "image" TEXT,
    "vehicle" TEXT NOT NULL,
    "fee_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "licence" TEXT NOT NULL,
    "tel" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Restaurant" (
    "id" INTEGER NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_available" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "fee_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "location" TEXT NOT NULL,
    "detail" TEXT,
    "tel" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RestaurantTag" (
    "id" SERIAL NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "RestaurantTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RestaurantGallery" (
    "id" SERIAL NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "RestaurantGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AvailableTime" (
    "id" SERIAL NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "week_day" "public"."WeekDay" NOT NULL,
    "opening_time" TIMESTAMP(3) NOT NULL,
    "closing_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailableTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DriverLocation" (
    "id" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "last_updated_at" TIMESTAMP(3),

    CONSTRAINT "DriverLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Dish" (
    "id" SERIAL NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "allergy" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "detail" TEXT,
    "is_out_of_stock" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FavoriteRestaurant" (
    "customer_id" INTEGER NOT NULL,
    "restaurant_id" INTEGER NOT NULL,

    CONSTRAINT "FavoriteRestaurant_pkey" PRIMARY KEY ("customer_id","restaurant_id")
);

-- CreateTable
CREATE TABLE "public"."FavoriteDish" (
    "customer_id" INTEGER NOT NULL,
    "dish_id" INTEGER NOT NULL,

    CONSTRAINT "FavoriteDish_pkey" PRIMARY KEY ("customer_id","dish_id")
);

-- CreateTable
CREATE TABLE "public"."PaymentMethod" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."PaymentType" NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coupon" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "type" "public"."CouponType" NOT NULL DEFAULT 'percent',
    "is_empty" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CouponUsage" (
    "coupon_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "CouponUsage_pkey" PRIMARY KEY ("coupon_id","customer_id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "image" TEXT,
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "driver_id" INTEGER,
    "location" TEXT NOT NULL,
    "status" "public"."OrderStatus" NOT NULL DEFAULT 'pending',
    "remark" TEXT,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "driver_fee" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderDish" (
    "order_id" INTEGER NOT NULL,
    "dish_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 1,
    "remark" TEXT,

    CONSTRAINT "OrderDish_pkey" PRIMARY KEY ("order_id","dish_id")
);

-- CreateTable
CREATE TABLE "public"."RestaurantReview" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "restaurant_id" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "review_text" TEXT,

    CONSTRAINT "RestaurantReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DriverReview" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "review_text" TEXT,

    CONSTRAINT "DriverReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Driver" ADD CONSTRAINT "Driver_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Restaurant" ADD CONSTRAINT "Restaurant_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RestaurantTag" ADD CONSTRAINT "RestaurantTag_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RestaurantGallery" ADD CONSTRAINT "RestaurantGallery_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AvailableTime" ADD CONSTRAINT "AvailableTime_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DriverLocation" ADD CONSTRAINT "DriverLocation_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Dish" ADD CONSTRAINT "Dish_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteRestaurant" ADD CONSTRAINT "FavoriteRestaurant_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteRestaurant" ADD CONSTRAINT "FavoriteRestaurant_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteDish" ADD CONSTRAINT "FavoriteDish_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FavoriteDish" ADD CONSTRAINT "FavoriteDish_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "public"."Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentMethod" ADD CONSTRAINT "PaymentMethod_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CouponUsage" ADD CONSTRAINT "CouponUsage_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CouponUsage" ADD CONSTRAINT "CouponUsage_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "public"."PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderDish" ADD CONSTRAINT "OrderDish_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderDish" ADD CONSTRAINT "OrderDish_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "public"."Dish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RestaurantReview" ADD CONSTRAINT "RestaurantReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RestaurantReview" ADD CONSTRAINT "RestaurantReview_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "public"."Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DriverReview" ADD CONSTRAINT "DriverReview_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DriverReview" ADD CONSTRAINT "DriverReview_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "public"."Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
