from flask import Flask
from instance.db import db
from models.authorModel import Author
from models.bookModel import Book

app = Flask(__name__)

app.config.from_object('instance.config.Config')

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Hello, Flask!"

