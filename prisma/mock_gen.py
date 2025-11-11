import os
import random
import string
import csv
from faker import Faker
from datetime import datetime, timedelta
import psycopg2

fake = Faker()

# --- ENUM DEFINITIONS (from Prisma) ---
ROLES = ["customer", "driver", "restaurant", "admin"]
WEEK_DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
ORDER_STATUSES = ["pending", "preparing", "delivered", "rejected", "success"]
PAYMENT_TYPES = ["cash", "mobilebanking", "creditcard"]
VERIFICATION_STATUSES = ["pending", "rejected", "approved"]
ALLERGY_TYPES = ["gluten", "peanuts", "seafood", "dairy", "eggs", "soy", "tree_nuts", "wheat", "fish", "shellfish"]

# --- MOCK CONFIG ---
NUM_CUSTOMERS = 100
NUM_DRIVERS = 20
NUM_RESTAURANTS = 15
NUM_ADMINS = 3
NUM_ORDERS_PER_CUSTOMER = 5

# --- FOOD DATA ---
FOOD_ITEMS = [
    "Margherita Pizza", "Cheeseburger", "Spaghetti Carbonara", "Caesar Salad",
    "California Roll", "Filet Mignon", "Fried Chicken", "Pad Thai", "Ramen", "Green Curry"
]
RESTAURANT_TAGS = ["Italian", "Thai", "Japanese", "Mexican", "Fast Food", "Healthy", "Dessert"]

# --- STORAGE ---
data = {
    "User": [], "Customer": [], "Driver": [], "Restaurant": [],
    "Location": [], "DriverLocation": [], "RestaurantTag": [],
    "RestaurantGallery": [], "AvailableTime": [], "Dish": [],
    "FavoriteRestaurant": [], "FavoriteDish": [], "PaymentMethod": [],
    "Payment": [], "Order": [],
    "OrderDish": [], "RestaurantReview": [], "DriverReview": [],
    "VerifyToken": [], "ResetToken": []
}

# --- ID Counters ---
id_counters = {
    "User": 1, "Location": 1, "RestaurantTag": 1, "RestaurantGallery": 1,
    "AvailableTime": 1, "Dish": 1, "PaymentMethod": 1,
    "Payment": 1, "Order": 1, "RestaurantReview": 1, "DriverReview": 1,
    "ResetToken": 1
}

def get_id(model):
    val = id_counters[model]
    id_counters[model] += 1
    return val

def create_user(role):
    user_id = get_id("User")
    now = fake.date_time_this_year()
    user = {
        "id": user_id,
        "email": fake.unique.email(),
        "password": fake.password(),
        "accepted_term_of_service": True,
        "accepted_pdpa": True,
        "created_at": now,
        "updated_at": now,
        "role": role
    }
    data["User"].append(user)
    return user_id, now

# -------------------------------
# PHASE 1: USERS
# -------------------------------
for _ in range(NUM_CUSTOMERS):
    user_id, ts = create_user("customer")
    allergies = random.sample(ALLERGY_TYPES, random.randint(0, 3))
    customer = {
        "id": user_id,
        "firstname": fake.first_name(),
        "lastname": fake.last_name(),
        "image": fake.image_url(),
        "tel": fake.phone_number(),
        "created_at": ts,
        "updated_at": ts,
        "allergy": "{%s}" % ",".join(allergies)  # PostgreSQL array syntax
    }
    data["Customer"].append(customer)

for _ in range(NUM_DRIVERS):
    user_id, ts = create_user("driver")
    driver = {
        "id": user_id,
        "verification_status": random.choice(VERIFICATION_STATUSES),
        "is_available": random.choice([True, False]),
        "firstname": fake.first_name(),
        "lastname": fake.last_name(),
        "image": fake.image_url(),
        "vehicle": f"{random.choice(['Toyota', 'Honda'])} {random.choice(['Sedan', 'Bike'])}",
        "fee_rate": round(random.uniform(0.1, 0.2), 2),
        "licence": fake.license_plate(),
        "tel": fake.phone_number(),
        "created_at": ts,
        "updated_at": ts,
    }
    data["Driver"].append(driver)
    data["DriverLocation"].append({
        "id": user_id,
        "latitude": float(fake.latitude()),
        "longitude": float(fake.longitude()),
        "last_updated_at": ts,
        "created_at": ts,
        "updated_at": ts
    })

for _ in range(NUM_RESTAURANTS):
    user_id, ts = create_user("restaurant")
    restaurant = {
        "id": user_id,
        "verification_status": "approved",
        "is_available": True,
        "name": fake.company(),
        "image": fake.image_url(),
        "fee_rate": round(random.uniform(0.1, 0.25), 2),
        "location": fake.address(),
        "detail": fake.text(120),
        "tel": fake.phone_number(),
        "created_at": ts,
        "updated_at": ts
    }
    data["Restaurant"].append(restaurant)

for _ in range(NUM_ADMINS):
    create_user("admin")

# -------------------------------
# PHASE 2: RESTAURANT DETAILS
# -------------------------------
for rest in data["Restaurant"]:
    rid = rest["id"]
    for tag in random.sample(RESTAURANT_TAGS, random.randint(2, 5)):
        data["RestaurantTag"].append({
            "id": get_id("RestaurantTag"),
            "restaurant_id": rid,
            "tag": tag,
            "created_at": rest["created_at"],
            "updated_at": rest["updated_at"],
        })
    for _ in range(3):
        data["RestaurantGallery"].append({
            "id": get_id("RestaurantGallery"),
            "restaurant_id": rid,
            "image": fake.image_url(),
            "created_at": rest["created_at"],
            "updated_at": rest["updated_at"],
        })
    for day in WEEK_DAYS:
        data["AvailableTime"].append({
            "id": get_id("AvailableTime"),
            "restaurant_id": rid,
            "week_day": day,
            "opening_time": datetime.now().replace(hour=9, minute=0),
            "closing_time": datetime.now().replace(hour=21, minute=0),
            "created_at": rest["created_at"],
            "updated_at": rest["updated_at"],
        })
    for _ in range(random.randint(8, 15)):
        allergies = random.sample(ALLERGY_TYPES, random.randint(0, 3))
        data["Dish"].append({
            "id": get_id("Dish"),
            "restaurant_id": rid,
            "name": random.choice(FOOD_ITEMS),
            "allergy": "{%s}" % ",".join(allergies),
            "price": round(random.uniform(5.99, 29.99), 2),
            "detail": fake.text(60),
            "is_out_of_stock": random.random() < 0.2,
            "created_at": rest["created_at"],
            "updated_at": rest["updated_at"],
        })

# -------------------------------
# PHASE 3: CUSTOMERS & ORDERS
# -------------------------------
restaurant_ids = [r["id"] for r in data["Restaurant"]]
dish_map = {}
for dish in data["Dish"]:
    dish_map.setdefault(dish["restaurant_id"], []).append(dish)

for cust in data["Customer"]:
    cid = cust["id"]
    # Locations
    for i in range(random.randint(1, 2)):
        data["Location"].append({
            "id": get_id("Location"),
            "customer_id": cid,
            "address": fake.address(),
            "is_default": (i == 0),
            "created_at": cust["created_at"],
            "updated_at": cust["updated_at"],
        })
    # Payment methods
    for i in range(random.randint(1, 2)):
        ptype = random.choice(PAYMENT_TYPES)
        data["PaymentMethod"].append({
            "id": get_id("PaymentMethod"),
            "user_id": cid,
            "title": f"Card {i+1}",
            "type": ptype,
            "detail": fake.credit_card_number() if ptype == "creditcard" else fake.phone_number(),
            "created_at": cust["created_at"],
            "updated_at": cust["updated_at"],
        })
    # Favorites
    for rest_id in random.sample(restaurant_ids, 2):
        data["FavoriteRestaurant"].append({
            "customer_id": cid,
            "restaurant_id": rest_id,
            "created_at": cust["created_at"],
            "updated_at": cust["updated_at"],
        })
    # Orders
    for _ in range(NUM_ORDERS_PER_CUSTOMER):
        rest_id = random.choice(restaurant_ids)
        driver_id = random.choice(data["Driver"])["id"] if random.random() < 0.8 else None
        dishes = random.sample(dish_map[rest_id], random.randint(1, 3))
        order_id = get_id("Order")
        total = sum(d["price"] * random.randint(1, 3) for d in dishes)
        driver_fee = round(total * 0.1, 2)
        total += driver_fee
        status = random.choice(ORDER_STATUSES)

        data["Order"].append({
            "id": order_id,
            "customer_id": cid,
            "driver_id": driver_id,
            "restaurant_id": rest_id,
            "location": fake.address(),
            "status": status,
            "remark": fake.text(40) if random.random() < 0.3 else None,
            "total_amount": total,
            "driver_fee": driver_fee,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
        })
        for d in dishes:
            data["OrderDish"].append({
                "order_id": order_id,
                "dish_id": d["id"],
                "amount": random.randint(1, 3),
                "remark": None,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            })

# -------------------------------
# PHASE 4: & TOKENS
# -------------------------------
for u in data["User"]:
    if random.random() < 0.1:
        data["VerifyToken"].append({
            "user_id": u["id"],
            "token": fake.sha256(),
            "created_at": u["created_at"],
            "expires_at": u["created_at"] + timedelta(days=1),
            "updated_at": u["updated_at"],
        })
    if random.random() < 0.05:
        data["ResetToken"].append({
            "id": get_id("ResetToken"),
            "token": fake.sha256(),
            "user_id": u["id"],
            "expires_at": u["created_at"] + timedelta(hours=2),
        })

# -------------------------------
# EXPORT TO CSV
# -------------------------------
os.makedirs("data", exist_ok=True)
for name, rows in data.items():
    if rows:
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
    "User", "Customer", "Driver", "Restaurant", "Location", "DriverLocation",
    "RestaurantTag", "RestaurantGallery", "AvailableTime", "Dish",
    "FavoriteRestaurant", "FavoriteDish", "PaymentMethod", "Order", "OrderDish", "Payment", "RestaurantReview",
    "DriverReview", "VerifyToken", "ResetToken"
]

try:
    conn = psycopg2.connect(**db_params)
    cur = conn.cursor()
    print("Resetting tables...")
    for t in reversed(tables):
        cur.execute(f'TRUNCATE TABLE "{t}" CASCADE;')
        print(f"Truncated {t}")
    print("Inserting data...")
    for t in tables:
        if t in data and data[t]:
            cols = list(data[t][0].keys())
            placeholders = ",".join(["%s"] * len(cols))
            query = f'INSERT INTO "{t}" ({",".join(cols)}) VALUES ({placeholders})'
            values = [tuple(r[c] for c in cols) for r in data[t]]
            cur.executemany(query, values)
            print(f"Inserted {len(values)} into {t}")
    conn.commit()
    print("✅ Data uploaded successfully!")

    auto_tables = [
        "User", "Location", "RestaurantTag", "RestaurantGallery",
        "AvailableTime", "Dish", "PaymentMethod",
        "Payment", "Order", "RestaurantReview", "DriverReview", "ResetToken"
    ]
    print("\n--- Syncing autoincrement sequences ---")
    for t in auto_tables:
        try:
            cur.execute(f"""
                SELECT setval(pg_get_serial_sequence('"{{t}}"', 'id'),
                COALESCE((SELECT MAX(id) FROM "{{t}}")+1, 1), false);
            """.format(t=t))
            print(f"Sequence synced for {t}")
        except Exception as e:
            print(f"Skipping {t}: {e}")
except Exception as e:
    print(f"❌ Error uploading to database: {e}")
    conn.rollback()
finally:
    if 'cur' in locals(): cur.close()
    if 'conn' in locals(): conn.close()