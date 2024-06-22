from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = "mongodb+srv://harriskhan1596:VTjF5T1zDIxvgUvP@vaasel.w0o745e.mongodb.net/?retryWrites=true&w=majority&appName=Vaasel"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db=None
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
finally:
    db = client.FormSmith