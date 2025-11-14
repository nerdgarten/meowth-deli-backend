import os
import csv
import uuid
import random
from datetime import datetime, timedelta
from typing import Optional

import psycopg2
from faker import Faker

fake = Faker()
random.seed(42)

# --- ENUM DEFINITIONS (mirrors prisma schema) ---
ROLES = ["customer", "driver", "restaurant", "admin"]
WEEK_DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
ORDER_STATUSES = ["pending", "preparing", "delivered", "rejected", "success"]
PAYMENT_TYPES = ["cash", "mobilebanking", "creditcard"]
VERIFICATION_STATUSES = ["pending", "rejected", "approved"]
ALLERGY_TYPES = ["gluten", "peanuts", "seafood", "dairy", "eggs", "soy", "tree_nuts", "wheat", "fish", "shellfish"]
RESTAURANT_TAGS = ["Italian", "Thai", "Japanese", "Mexican", "Fast Food", "Healthy", "Dessert", "Vegan"]

# --- MOCK CONFIG ---
NUM_CUSTOMERS = 80
NUM_DRIVERS = 25
NUM_RESTAURANTS = 18
NUM_ADMINS = 4
NUM_ORDERS_PER_CUSTOMER = 4
NUM_REPORTS = 12

# --- STORAGE ---
data = {
    "User": [],
    "Customer": [],
    "Driver": [],
    "Restaurant": [],
    "RestaurantTag": [],
    "AvailableTime": [],
    "Location": [],
    "CustomerLocation": [],
    "Dish": [],
    "FavoriteRestaurant": [],
    "FavoriteDish": [],
    "PaymentMethod": [],
    "Payment": [],
    "Order": [],
    "OrderDish": [],
    "RestaurantReview": [],
    "DriverReview": [],
    "VerifyToken": [],
    "ResetToken": [],
    "Report": [],
}

# --- ID Counters for auto-increment tables ---
AUTO_ID_TABLES = [
    "User",
    "Location",
    "RestaurantTag",
    "AvailableTime",
    "CustomerLocation",
    "Dish",
    "PaymentMethod",
    "Payment",
    "Order",
    "RestaurantReview",
    "DriverReview",
    "Report",
    "ResetToken",
]
id_counters = {table: 1 for table in AUTO_ID_TABLES}


def next_id(table: str) -> int:
    value = id_counters[table]
    id_counters[table] += 1
    return value


def enum_array_literal(values) -> str:
    return "{%s}" % ",".join(values) if values else "{}"


def text_array_literal(values) -> str:
    if not values:
        return "{}"
    escaped = []
    for value in values:
        sanitized = value.replace("\\", "\\\\").replace('"', '\\"')
        escaped.append(f'"{sanitized}"')
    return "{%s}" % ",".join(escaped)


def create_location(address: Optional[str] = None, created_at: Optional[datetime] = None) -> dict:
    loc_id = next_id("Location")
    ts = created_at or fake.date_time_between(start_date="-120d", end_date="now")
    location = {
        "id": loc_id,
        "latitude": float(fake.latitude()),
        "longitude": float(fake.longitude()),
        "address": address or fake.address(),
        "created_at": ts,
        "updated_at": ts,
    }
    data["Location"].append(location)
    return location


def create_user(role: str) -> dict:
    if role not in ROLES:
        raise ValueError(f"Unknown role {role}")
    ts = fake.date_time_between(start_date="-180d", end_date="now")
    user = {
        "id": next_id("User"),
        "email": fake.unique.email(),
        "password": fake.password(length=16),
        "accepted_term_of_service": True,
        "accepted_pdpa": True,
        "created_at": ts,
        "updated_at": ts,
        "role": role,
    }
    data["User"].append(user)
    return user


def create_payment_method(user_id: int, created_at: datetime) -> int:
    pm_id = next_id("PaymentMethod")
    pm_type = random.choice(PAYMENT_TYPES)
    if pm_type == "creditcard":
        detail = fake.credit_card_number()
    elif pm_type == "mobilebanking":
        detail = fake.phone_number()
    else:
        detail = "Pay on delivery"
    method = {
        "id": pm_id,
        "user_id": user_id,
        "title": f"{pm_type.title()} {random.randint(1000, 9999)}",
        "type": pm_type,
        "detail": detail,
        "created_at": created_at,
        "updated_at": created_at,
    }
    data["PaymentMethod"].append(method)
    return pm_id


print("--- Warning: This will overwrite data in the 'nerdgarten' PostgreSQL database! ---\n Enter to proceed")
input()


# -------------------------------
# PHASE 1: USERS & PROFILES
# -------------------------------
customer_locations = {}
customer_payment_methods = {}
customers = []
drivers = []
restaurants = []

for _ in range(NUM_CUSTOMERS):
    user = create_user("customer")
    allergies = random.sample(ALLERGY_TYPES, random.randint(0, 3))
    customer = {
        "id": user["id"],
        "firstname": fake.first_name(),
        "lastname": fake.last_name(),
        "default_location_id": None,
        "image": fake.image_url(),
        "tel": fake.phone_number(),
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
        "allergy": enum_array_literal(allergies),
    }

    saved_locations = []
    for i in range(random.randint(1, 3)):
        loc = create_location(created_at=user["created_at"])
        cl_id = next_id("CustomerLocation")
        entry = {
            "id": cl_id,
            "customer_id": user["id"],
            "location_id": loc["id"],
            "created_at": user["created_at"],
            "updated_at": user["updated_at"],
        }
        data["CustomerLocation"].append(entry)
        saved_locations.append({"customer_location_id": cl_id, "location_id": loc["id"]})
    if saved_locations:
        customer["default_location_id"] = saved_locations[0]["customer_location_id"]
    customer_locations[user["id"]] = saved_locations

    methods = []
    for _ in range(random.randint(1, 2)):
        methods.append(create_payment_method(user["id"], user["created_at"]))
    customer_payment_methods[user["id"]] = methods

    data["Customer"].append(customer)
    customers.append(customer)

for _ in range(NUM_DRIVERS):
    user = create_user("driver")
    loc = create_location(created_at=user["created_at"])
    driver = {
        "id": user["id"],
        "verification_status": random.choice(VERIFICATION_STATUSES),
        "is_available": random.choice([True, False]),
        "firstname": fake.first_name(),
        "lastname": fake.last_name(),
        "image": fake.image_url(),
        "vehicle": f"{random.choice(['Toyota', 'Honda', 'Yamaha'])} {random.choice(['Sedan', 'Pickup', 'Bike'])}",
        "fee_rate": round(random.uniform(0.08, 0.18), 2),
        "licence": fake.license_plate(),
        "tel": fake.phone_number(),
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
        "location_id": loc["id"],
    }
    data["Driver"].append(driver)
    drivers.append(driver)

for _ in range(NUM_RESTAURANTS):
    user = create_user("restaurant")
    loc = create_location(created_at=user["created_at"])
    restaurant = {
        "id": user["id"],
        "verification_status": "approved",
        "is_available": True,
        "name": fake.company(),
        "banner": fake.image_url(),
        "fee_rate": round(random.uniform(0.1, 0.25), 2),
        "location_id": loc["id"],
        "detail": fake.text(max_nb_chars=160),
        "tel": fake.phone_number(),
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
    }
    data["Restaurant"].append(restaurant)
    restaurants.append(restaurant)

for _ in range(NUM_ADMINS):
    create_user("admin")

# -------------------------------
# PHASE 2: RESTAURANT DETAILS
# -------------------------------
dishes_by_restaurant = {}
all_dish_ids = []

opening_time = datetime.utcnow().replace(hour=9, minute=0, second=0, microsecond=0)
closing_time = datetime.utcnow().replace(hour=22, minute=0, second=0, microsecond=0)

for rest in restaurants:
    rid = rest["id"]
    dishes_by_restaurant[rid] = []

    tags = random.sample(RESTAURANT_TAGS, random.randint(2, min(5, len(RESTAURANT_TAGS))))
    for tag in tags:
        data["RestaurantTag"].append(
            {
                "id": next_id("RestaurantTag"),
                "restaurant_id": rid,
                "tag": tag,
                "created_at": rest["created_at"],
                "updated_at": rest["updated_at"],
            }
        )

    for day in WEEK_DAYS:
        data["AvailableTime"].append(
            {
                "id": next_id("AvailableTime"),
                "restaurant_id": rid,
                "week_day": day,
                "opening_time": opening_time,
                "closing_time": closing_time,
                "created_at": rest["created_at"],
                "updated_at": rest["updated_at"],
            }
        )

    for _ in range(random.randint(10, 18)):
        allergies = random.sample(ALLERGY_TYPES, random.randint(0, 3))
        dish = {
            "id": next_id("Dish"),
            "restaurant_id": rid,
            "name": fake.unique.catch_phrase(),
            "allergy": enum_array_literal(allergies),
            "price": round(random.uniform(5.0, 40.0), 2),
            "detail": fake.text(max_nb_chars=100),
            "image": fake.image_url(),
            "is_out_of_stock": random.random() < 0.15,
            "created_at": rest["created_at"],
            "updated_at": rest["updated_at"],
        }
        data["Dish"].append(dish)
        dishes_by_restaurant[rid].append(dish)
        all_dish_ids.append(dish["id"])

fake.unique.clear()

# -------------------------------
# PHASE 3: FAVORITES & ORDERS
# -------------------------------
restaurant_ids = [r["id"] for r in restaurants]
driver_ids = [d["id"] for d in drivers]

for customer in customers:
    cid = customer["id"]
    customer_ts = customer["created_at"]
    if restaurant_ids:
        fav_count = min(len(restaurant_ids), random.randint(1, 3))
        for rest_id in random.sample(restaurant_ids, fav_count):
            data["FavoriteRestaurant"].append(
                {
                    "customer_id": cid,
                    "restaurant_id": rest_id,
                    "created_at": customer_ts,
                    "updated_at": customer_ts,
                }
            )
    if all_dish_ids:
        fav_dish_count = min(len(all_dish_ids), random.randint(1, 5))
        for dish_id in random.sample(all_dish_ids, fav_dish_count):
            data["FavoriteDish"].append(
                {
                    "customer_id": cid,
                    "dish_id": dish_id,
                    "created_at": customer_ts,
                    "updated_at": customer_ts,
                }
            )

for customer in customers:
    cid = customer["id"]
    locations = customer_locations.get(cid) or []
    payment_methods = customer_payment_methods.get(cid) or []
    if not locations or not payment_methods or not restaurant_ids:
        continue

    for _ in range(NUM_ORDERS_PER_CUSTOMER):
        rest_id = random.choice(restaurant_ids)
        available_dishes = dishes_by_restaurant[rest_id]
        if not available_dishes:
            continue
        order_items = random.sample(available_dishes, random.randint(1, min(3, len(available_dishes))))
        location_choice = random.choice(locations)
        driver_id = random.choice(driver_ids) if driver_ids and random.random() < 0.75 else None
        order_ts = fake.date_time_between(start_date="-45d", end_date="now")
        order_id = next_id("Order")

        subtotal = 0.0
        for dish in order_items:
            qty = random.randint(1, 3)
            subtotal += dish["price"] * qty
            data["OrderDish"].append(
                {
                    "order_id": order_id,
                    "dish_id": dish["id"],
                    "amount": qty,
                    "remark": None,
                    "created_at": order_ts,
                    "updated_at": order_ts,
                }
            )
        driver_fee = round(subtotal * random.uniform(0.08, 0.15), 2)
        total_amount = round(subtotal + driver_fee, 2)
        status = random.choice(ORDER_STATUSES)

        order = {
            "id": order_id,
            "customer_id": cid,
            "driver_id": driver_id,
            "restaurant_id": rest_id,
            "delivery_location_id": location_choice["location_id"],
            "status": status,
            "remark": fake.sentence(nb_words=8) if random.random() < 0.25 else None,
            "total_amount": total_amount,
            "driver_fee": driver_fee,
            "created_at": order_ts,
            "updated_at": order_ts,
        }
        data["Order"].append(order)
        payment_method_id = random.choice(payment_methods)
        data["Payment"].append(
            {
                "id": next_id("Payment"),
                "order_id": order_id,
                "payment_method_id": payment_method_id,
                "image": fake.image_url() if random.random() < 0.4 else None,
                "status": random.choice(VERIFICATION_STATUSES),
                "created_at": order_ts,
                "updated_at": order_ts,
            }
        )

        if status in ("delivered", "success") and random.random() < 0.6:
            data["RestaurantReview"].append(
                {
                    "id": next_id("RestaurantReview"),
                    "user_id": cid,
                    "restaurant_id": rest_id,
                    "order_id": order_id,
                    "rate": round(random.uniform(3.0, 5.0), 1),
                    "images": text_array_literal([fake.image_url() for _ in range(random.randint(0, 2))]) if random.random() < 0.3 else text_array_literal([]),
                    "review_text": fake.text(max_nb_chars=80) if random.random() < 0.5 else None,
                    "created_at": order_ts,
                    "updated_at": order_ts,
                }
            )

        if driver_id and status in ("delivered", "success") and random.random() < 0.5:
            data["DriverReview"].append(
                {
                    "id": next_id("DriverReview"),
                    "customer_id": cid,
                    "driver_id": driver_id,
                    "order_id": order_id,
                    "rate": round(random.uniform(3.0, 5.0), 1),
                    "images": text_array_literal([fake.image_url() for _ in range(random.randint(0, 2))]) if random.random() < 0.3 else text_array_literal([]),
                    "review_text": fake.text(max_nb_chars=80) if random.random() < 0.4 else None,
                    "created_at": order_ts,
                    "updated_at": order_ts,
                }
            )

# -------------------------------
# PHASE 4: REPORTS & TOKENS
# -------------------------------
if customers and len(data["User"]) > 1:
    user_ids = [u["id"] for u in data["User"]]
    for _ in range(min(NUM_REPORTS, len(customers))):
        reporter = random.choice(customers)
        reported_id = random.choice([uid for uid in user_ids if uid != reporter["id"]])
        created_at = fake.date_time_between(start_date="-60d", end_date="now")
        images = [fake.image_url() for _ in range(random.randint(0, 2))]

        data["Report"].append(
            {
                "id": next_id("Report"),
                "customer_id": reporter["id"],
                "reported_id": reported_id,
                "reason": random.choice(["late delivery", "rude behavior", "spoiled food", "other"]),
                "detail": fake.text(max_nb_chars=140),
                "associated_image": text_array_literal(images),
                "created_at": created_at,
                "updated_at": created_at,
            }
        )

for user in data["User"]:
    if random.random() < 0.12:
        created = user["created_at"]
        data["VerifyToken"].append(
            {
                "user_id": user["id"],
                "token": uuid.uuid4().hex,
                "created_at": created,
                "expires_at": created + timedelta(days=1),
                "updated_at": user["updated_at"],
            }
        )
    if random.random() < 0.08:
        created = user["created_at"] + timedelta(days=random.randint(1, 30))
        data["ResetToken"].append(
            {
                "id": next_id("ResetToken"),
                "token": uuid.uuid4().hex,
                "user_id": user["id"],
                "expires_at": created + timedelta(hours=2),
            }
        )

# -------------------------------
# EXPORT TO CSV
# -------------------------------
os.makedirs("data", exist_ok=True)
for name, rows in data.items():
    if not rows:
        continue
    path = os.path.join("data", f"{name}.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"✅ Exported {len(rows)} {name} records")

# -------------------------------
# UPLOAD TO POSTGRESQL
# -------------------------------
print("\n--- Uploading data to PostgreSQL database ---")

db_params = {
    "dbname": "nerdgarten",
    "user": "root",
    "password": "12345",
    "host": "localhost",
    "port": "5434",
}

tables = [
    "User",
    "Location",
    "Customer",
    "Driver",
    "Restaurant",
    "RestaurantTag",
    "AvailableTime",
    "CustomerLocation",
    "Dish",
    "FavoriteRestaurant",
    "FavoriteDish",
    "PaymentMethod",
    "Order",
    "OrderDish",
    "Payment",
    "RestaurantReview",
    "DriverReview",
    "Report",
    "VerifyToken",
    "ResetToken",
]

try:
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()
    print("Resetting tables...")
    for table in reversed(tables):
        cur.execute(f'TRUNCATE TABLE "{table}" CASCADE;')
        print(f"Truncated {table}")

    print("Inserting data...")
    for table in tables:
        rows = data.get(table)
        if not rows:
            continue
        columns = list(rows[0].keys())
        placeholders = ",".join(["%s"] * len(columns))
        query = f'INSERT INTO "{table}" ({",".join(columns)}) VALUES ({placeholders})'
        values = [tuple(row[col] for col in columns) for row in rows]
        cur.executemany(query, values)
        print(f"Inserted {len(values)} into {table}")

    conn.commit()
    print("✅ Data uploaded successfully!")

    auto_tables = [
        "User",
        "Location",
        "RestaurantTag",
        "AvailableTime",
        "CustomerLocation",
        "Dish",
        "PaymentMethod",
        "Payment",
        "Order",
        "RestaurantReview",
        "DriverReview",
        "Report",
        "ResetToken",
    ]
    print("\n--- Syncing autoincrement sequences ---")
    for table in auto_tables:
        try:
            cur.execute(
                f"""
                SELECT setval(
                    pg_get_serial_sequence('"{table}"', 'id'),
                    COALESCE((SELECT MAX(id) FROM "{table}"), 0) + 1,
                    false
                );
                """
            )
            print(f"Sequence synced for {table}")
        except Exception as exc:
            print(f"Skipping {table}: {exc}")
except Exception as exc:
    print(f"❌ Error uploading to database: {exc}")
    if "conn" in locals():
        conn.rollback()
finally:
    if "cur" in locals():
        cur.close()
    if "conn" in locals():
        conn.close()
