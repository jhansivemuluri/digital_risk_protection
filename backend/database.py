
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "digital_risk_protection")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI missing. Check your .env file.")

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=10000
)

db = client[DATABASE_NAME]


def test_connection():
    client.admin.command("ping")
    print("MongoDB Atlas connected successfully!")


if __name__ == "__main__":
    test_connection()
