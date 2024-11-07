from instance.db import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    tasks = db.relationship('Task', backref='User', cascade='all, delete-orphan', lazy=True)

    @classmethod
    def get_by_username(self, username):
        """Busca um usuário pelo username."""
        return self.query.filter_by(username=username).first()

    @classmethod
    def get_all(self):
        """Retorna todos os usuários."""
        return self.query.all()

    @classmethod
    def get_by_id(self, user_id):
        """Busca um usuário pelo ID."""
        return self.query.get(user_id)
    
    @classmethod
    def create_user(self, name, username, password):
        """Cria e insere um novo usuário no banco de dados."""
        new_user = self(name=name, username=username, password=password)
        db.session.add(new_user)
        db.session.commit()
        return new_user