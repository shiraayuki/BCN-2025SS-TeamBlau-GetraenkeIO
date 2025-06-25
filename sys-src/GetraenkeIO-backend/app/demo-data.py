from models import *
from core.security import get_password_hash

# Demo-Daten in die Datenbank einfügen.
def insert_demo_data(session):
    users = [
        UserPost(name="SpeziFreund", password=get_password_hash("SpeziFreund")),
        UserPost(name="Alice", password=get_password_hash("Alice")),
        UserPost(name="BierBuddy", password=get_password_hash("BierBuddy")),
        UserPost(name="Peter", password=get_password_hash("Peter")),
    ]
    drinks = [
        DrinkPost(name="Spezi", imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0KGL9qCg_PnCJwzUrA2sYinvZiOV_JMwVLw&s", count=30, cost=2.50),
        DrinkPost(name="Cola", imageUrl="https://greenlovers.de/media/catering/1380_Product-768x768.png", count=30, cost=2.50),
        DrinkPost(name="Bier", imageUrl="https://brauer-bund.de/wp-content/uploads/2021/01/Denver_Seidel_03l_165mm-712x1024.jpg", count=20, cost=1.50),
        DrinkPost(name="Apfelschorle", imageUrl="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRNHuL16HMb1Vd3tvK8F6VB1bMp5UKg6fA02f86L0m3HoQDPMvleXodBGRfDWdxX9nxs6b5LaSWO3fnvXsAuO0vpy7KahvGxEUc8C-BHsRH4eXopnFq2IcL", count=20, cost=2.00)
    ]
    recharges = [
        rec
    ]
    pass