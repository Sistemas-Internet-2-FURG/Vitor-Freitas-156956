from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config.from_object('instance.config.Config')

db = SQLAlchemy(app)
from models.authorModel import Author
from models.bookModel import Book

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Hello, Flask!"

