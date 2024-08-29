from instance.server import db

class Author(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    biography = db.Column(db.Text, nullable=True)
    books = db.relationship('Book', backref='author', cascade='all, delete-orphan', lazy=True)
