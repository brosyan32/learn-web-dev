from fastapi import FastAPI
from fastapi.responses import PlainTextResponse

app = FastAPI()

categories = [
    {"id": 1, "name": "Стрижки и укладки", "servicesCount": 5},
    {"id": 2, "name": "Маникюр и педикюр", "servicesCount": 5},
    {"id": 3, "name": "Брови и ресницы", "servicesCount": 4},
    {"id": 4, "name": "Спа-процедуры", "servicesCount": 4},
]


# Задание 1. Список категорий
@app.get("/categories")
def get_categories():
    return categories


# Задание 2. Информация по категории
@app.get("/categories/{category_id}")
def get_category(category_id: int):
    for category in categories:
        if category["id"] == category_id:
            return category
    return PlainTextResponse("Category not found", status_code=404)