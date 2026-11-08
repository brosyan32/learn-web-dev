from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

# ---------- База данных ----------
engine = create_engine(
    "sqlite:///salon.db",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False)


class Base(DeclarativeBase):
    pass


# ---------- Задание 1. Модель Master ----------
class Master(Base):
    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    specialization: Mapped[str] = mapped_column(String(100))


# Схема ответа API
class MasterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    specialization: str


# Создаём таблицу и заполняем начальными данными, если она пустая
Base.metadata.create_all(engine)
with SessionLocal() as session:
    if session.scalar(select(Master).limit(1)) is None:
        session.add_all([
            Master(name="Анна", specialization="Парикмахер"),
            Master(name="Мария", specialization="Визажист"),
        ])
        session.commit()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Задание 2. API ----------
app = FastAPI()


# GET /masters и GET /masters?specialization=Парикмахер
@app.get("/masters", response_model=list[MasterOut])
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    query = select(Master)
    if specialization is not None:
        query = query.where(Master.specialization == specialization)
    return db.scalars(query).all()


# GET /masters/{master_id}
@app.get("/masters/{master_id}", response_model=MasterOut)
def get_master(master_id: int, db: Session = Depends(get_db)):
    master = db.get(Master, master_id)
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master