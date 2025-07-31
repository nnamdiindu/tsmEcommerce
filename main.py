import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from flask import Flask, render_template, request, url_for, redirect, flash, send_file, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, relationship
from flask_login import login_required, login_user, current_user, LoginManager, logout_user, UserMixin
from sqlalchemy import String, Integer, ForeignKey, Float, LargeBinary, select, DateTime
from werkzeug.security import generate_password_hash, check_password_hash
# from flask_bootstrap import Bootstrap5
from werkzeug.utils import secure_filename
from io import BytesIO
from paystack_api import PaystackAPI


app = Flask(__name__)

load_dotenv()


# Paystack configuration
PAYSTACK_SECRET_KEY = os.environ.get("PAYSTACK_SECRET_KEY")
PAYSTACK_BASE_URL = "https://api.paystack.co"

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DB_URI")
app.secret_key = os.environ.get("SECRET_KEY")
# bootstrap = Bootstrap5(app)
login_manager = LoginManager()
login_manager.init_app(app)


# Initialize Paystack API
paystack = PaystackAPI(PAYSTACK_SECRET_KEY)

@login_manager.user_loader
def load_user(user_id):
    return db.get_or_404(User, user_id)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
db.init_app(app)


class User(UserMixin, db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    create_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    # Relationship to orders
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="user")


class StoreCollection(db.Model):
    __tablename__ = "store_collection"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    brand_name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(200), nullable=False)
    filename: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    mimetype: Mapped[str] = mapped_column(String(100), nullable=False)  # Fixed missing type annotation

    # Relationship to orders
    orders: Mapped[list["Order"]] = relationship("Order", back_populates="collection")


class Order(db.Model):
    __tablename__ = "order"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(320), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    reference: Mapped[str] = mapped_column(String(322), nullable=False)
    status: Mapped[str] = mapped_column(String(100), nullable=False)
    paid_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    # Foreign keys
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    collection_id: Mapped[int] = mapped_column(Integer, ForeignKey("store_collection.id"), nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="orders")
    collection: Mapped["StoreCollection"] = relationship("StoreCollection", back_populates="orders")


# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/shop")
def shop():
    return render_template("shop.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("confirmPassword")

        user = db.session.execute(db.select(User).where(User.email == email)).scalar()

        if user:
            flash("You've already signed up, please login.")
            return redirect(url_for("login"))

        if password != confirm_password:
            flash("Passwords do not match, please try again")
            return redirect(url_for("register"))

        hashed_and_salted_password = generate_password_hash(
            password=password,
            method="pbkdf2:sha256",
            salt_length=8
        )
        new_user = User(
            name=request.form.get("name"),
            email=email,
            phone=request.form.get("phone"),
            password=hashed_and_salted_password
        )
        db.session.add(new_user)
        db.session.commit()

        login_user(new_user)
        return redirect(url_for("index"))

    return render_template("register.html", current_user=current_user)

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        user = db.session.execute(db.select(User).where(User.email == email)).scalar()

        if user:
            if check_password_hash(user.password, password):
                login_user(user)
                return redirect(url_for("index"))
            else:
                flash("Incorrect password, please try again.")
                return redirect(url_for("login"))
        else:
            flash("Email doesn't exist, please sign up.")
            return redirect(url_for("register"))

    return render_template("login.html", current_user=current_user)

@app.route("/checkout")
def checkout():
    return render_template("checkout.html")

@app.route("/cart")
def cart():
    return render_template("cart.html")

if __name__ == "__main__":
    app.run(debug=True)