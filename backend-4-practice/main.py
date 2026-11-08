from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field, StringConstraints
from sqlalchemy import Float, ForeignKey, Integer, String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

# ---------- База данных ----------
engine = create_engine(
    "sqlite:///salon.db",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    title: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(100))
    duration: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Float)


Base.metadata.create_all(engine)

# Начальные категории, если таблица пустая
with SessionLocal() as session:
    if session.scalar(select(Category).limit(1)) is None:
        session.add_all([
            Category(name="Стрижки и укладки"),
            Category(name="Маникюр и педикюр"),
            Category(name="Брови и ресницы"),
            Category(name="Спа-процедуры"),
        ])
        session.commit()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Задание 1. Pydantic-модель ----------
# Не пустая строка (пробелы по краям обрезаются), максимум 100 символов
NonEmptyStr = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=100)]


class ServiceCreate(BaseModel):
    categoryId: int = Field(gt=0)
    title: NonEmptyStr
    desc: NonEmptyStr
    duration: int = Field(ge=30, le=180)  # от 30 минут до 3 часов
    price: float = Field(gt=0)            # больше нуля


class ServiceOut(BaseModel):
    id: int
    categoryId: int
    title: str
    desc: str
    duration: int
    price: float


def to_out(service: Service) -> ServiceOut:
    return ServiceOut(
        id=service.id,
        categoryId=service.category_id,
        title=service.title,
        desc=service.description,
        duration=service.duration,
        price=service.price,
    )


# ---------- Задание 2. API ----------
app = FastAPI()


@app.post("/services", response_model=ServiceOut, status_code=201)
def create_service(data: ServiceCreate, db: Session = Depends(get_db)):
    # Услугу можно добавить только в существующую категорию
    if db.get(Category, data.categoryId) is None:
        raise HTTPException(status_code=404, detail="Category not found")

    service = Service(
        category_id=data.categoryId,
        title=data.title,
        description=data.desc,
        duration=data.duration,
        price=data.price,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return to_out(service)


# Для проверки: посмотреть, что лежит в БД
@app.get("/services", response_model=list[ServiceOut])
def get_services(db: Session = Depends(get_db)):
    return [to_out(s) for s in db.scalars(select(Service)).all()]