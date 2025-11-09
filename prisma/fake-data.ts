import { Role, WeekDay, OrderStatus, PaymentType, VerificationStatus, CouponType } from '../src/generated/prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';



export function fakeUser() {
  return {
    email: faker.internet.email(),
    password: faker.lorem.words(5),
    updated_at: faker.date.anytime(),
  };
}
export function fakeUserComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
    accepted_term_of_service: false,
    accepted_pdpa: false,
    accepted_cookie_tracking: false,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeUserRole() {
  return {
    updated_at: faker.date.anytime(),
  };
}
export function fakeUserRoleComplete() {
  return {
    user_id: faker.number.int(),
    role: Role.customer,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeCustomer() {
  return {
    firstname: faker.lorem.words(5),
    lastname: faker.lorem.words(5),
    image: undefined,
    tel: faker.lorem.words(5),
    updated_at: faker.date.anytime(),
  };
}
export function fakeCustomerComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    firstname: faker.lorem.words(5),
    lastname: faker.lorem.words(5),
    image: undefined,
    tel: faker.lorem.words(5),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeLocation() {
  return {
    address: faker.lorem.words(5),
    updated_at: faker.date.anytime(),
  };
}
export function fakeLocationComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    customer_id: faker.number.int(),
    address: faker.lorem.words(5),
    is_default: false,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeDriver() {
  return {
    firstname: faker.lorem.words(5),
    lastname: faker.lorem.words(5),
    image: undefined,
    vehicle: undefined,
    licence: undefined,
    tel: faker.lorem.words(5),
    updated_at: faker.date.anytime(),
  };
}
export function fakeDriverComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    verification_status: VerificationStatus.pending,
    is_available: false,
    firstname: faker.lorem.words(5),
    lastname: faker.lorem.words(5),
    image: undefined,
    vehicle: undefined,
    fee_rate: 0.1,
    licence: undefined,
    tel: faker.lorem.words(5),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeRestaurant() {
  return {
    name: faker.person.fullName(),
    image: undefined,
    location: faker.lorem.words(5),
    detail: undefined,
    tel: faker.lorem.words(5),
    updated_at: faker.date.anytime(),
  };
}
export function fakeRestaurantComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    verification_status: VerificationStatus.pending,
    is_available: false,
    name: faker.person.fullName(),
    image: undefined,
    fee_rate: 0.1,
    location: faker.lorem.words(5),
    detail: undefined,
    tel: faker.lorem.words(5),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeRestaurantTag() {
  return {
    tag: faker.lorem.words(5),
    updated_at: faker.date.anytime(),
  };
}
export function fakeRestaurantTagComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    restaurant_id: faker.number.int(),
    tag: faker.lorem.words(5),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeRestaurantGallery() {
  return {
    image: faker.image.avatar(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeRestaurantGalleryComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    restaurant_id: faker.number.int(),
    image: faker.image.avatar(),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeAvailableTime() {
  return {
    week_day: faker.helpers.arrayElement([WeekDay.sunday, WeekDay.monday, WeekDay.tuesday, WeekDay.wednesday, WeekDay.thursday, WeekDay.friday, WeekDay.saturday] as const),
    opening_time: faker.date.anytime(),
    closing_time: faker.date.anytime(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeAvailableTimeComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    restaurant_id: faker.number.int(),
    week_day: faker.helpers.arrayElement([WeekDay.sunday, WeekDay.monday, WeekDay.tuesday, WeekDay.wednesday, WeekDay.thursday, WeekDay.friday, WeekDay.saturday] as const),
    opening_time: faker.date.anytime(),
    closing_time: faker.date.anytime(),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeNotification() {
  return {
    title: faker.lorem.words(5),
    message: undefined,
    updated_at: faker.date.anytime(),
  };
}
export function fakeNotificationComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    user_id: faker.number.int(),
    title: faker.lorem.words(5),
    message: undefined,
    is_read: false,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeDriverLocation() {
  return {
    latitude: faker.number.float(),
    longitude: faker.number.float(),
    last_updated_at: undefined,
    updated_at: faker.date.anytime(),
  };
}
export function fakeDriverLocationComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    latitude: faker.number.float(),
    longitude: faker.number.float(),
    last_updated_at: undefined,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeDish() {
  return {
    name: faker.person.fullName(),
    allergy: undefined,
    price: faker.number.float(),
    detail: undefined,
    updated_at: faker.date.anytime(),
  };
}
export function fakeDishComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    restaurant_id: faker.number.int(),
    name: faker.person.fullName(),
    allergy: undefined,
    price: faker.number.float(),
    detail: undefined,
    is_out_of_stock: false,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeFavoriteRestaurant() {
  return {
    updated_at: faker.date.anytime(),
  };
}
export function fakeFavoriteRestaurantComplete() {
  return {
    customer_id: faker.number.int(),
    restaurant_id: faker.number.int(),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeFavoriteDish() {
  return {
    updated_at: faker.date.anytime(),
  };
}
export function fakeFavoriteDishComplete() {
  return {
    customer_id: faker.number.int(),
    dish_id: faker.number.int(),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakePaymentMethod() {
  return {
    title: faker.lorem.words(5),
    type: faker.helpers.arrayElement([PaymentType.cash, PaymentType.mobilebanking, PaymentType.creditcard] as const),
    detail: faker.lorem.words(5),
    updated_at: faker.date.anytime(),
  };
}
export function fakePaymentMethodComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    user_id: faker.number.int(),
    title: faker.lorem.words(5),
    type: faker.helpers.arrayElement([PaymentType.cash, PaymentType.mobilebanking, PaymentType.creditcard] as const),
    detail: faker.lorem.words(5),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeCoupon() {
  return {
    code: faker.lorem.words(5),
    updated_at: faker.date.anytime(),
  };
}
export function fakeCouponComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    code: faker.lorem.words(5),
    amount: 0,
    value: 1,
    type: CouponType.percent,
    is_empty: false,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeCouponUsage() {
  return {
    updated_at: faker.date.anytime(),
  };
}
export function fakeCouponUsageComplete() {
  return {
    coupon_id: faker.number.int(),
    customer_id: faker.number.int(),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakePayment() {
  return {
    image: undefined,
    updated_at: faker.date.anytime(),
  };
}
export function fakePaymentComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    order_id: faker.number.int(),
    payment_method_id: faker.number.int(),
    image: undefined,
    status: VerificationStatus.pending,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeOrder() {
  return {
    restaurant_id: faker.number.int(),
    location: faker.lorem.words(5),
    remark: undefined,
    total_amount: faker.number.float(),
    driver_fee: faker.number.float(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeOrderComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    customer_id: faker.number.int(),
    driver_id: undefined,
    restaurant_id: faker.number.int(),
    location: faker.lorem.words(5),
    status: OrderStatus.pending,
    remark: undefined,
    total_amount: faker.number.float(),
    driver_fee: faker.number.float(),
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeOrderDish() {
  return {
    remark: undefined,
    updated_at: faker.date.anytime(),
  };
}
export function fakeOrderDishComplete() {
  return {
    order_id: faker.number.int(),
    dish_id: faker.number.int(),
    amount: 1,
    remark: undefined,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeRestaurantReview() {
  return {
    rate: faker.number.float(),
    review_text: undefined,
    updated_at: faker.date.anytime(),
  };
}
export function fakeRestaurantReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    user_id: faker.number.int(),
    restaurant_id: faker.number.int(),
    order_id: faker.number.int(),
    rate: faker.number.float(),
    review_text: undefined,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeDriverReview() {
  return {
    rate: faker.number.float(),
    review_text: undefined,
    updated_at: faker.date.anytime(),
  };
}
export function fakeDriverReviewComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    customer_id: faker.number.int(),
    driver_id: faker.number.int(),
    order_id: faker.number.int(),
    rate: faker.number.float(),
    review_text: undefined,
    created_at: new Date(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeVerifyToken() {
  return {
    expires_at: faker.date.anytime(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeVerifyTokenComplete() {
  return {
    user_id: faker.number.int(),
    token: faker.string.uuid(),
    created_at: new Date(),
    expires_at: faker.date.anytime(),
    updated_at: faker.date.anytime(),
  };
}
export function fakeResetToken() {
  return {
    token: faker.lorem.words(5),
    expires_at: undefined,
  };
}
export function fakeResetTokenComplete() {
  return {
    id: faker.number.int({ max: 2147483647 }),
    token: faker.lorem.words(5),
    user_id: faker.number.int(),
    expires_at: undefined,
  };
}
