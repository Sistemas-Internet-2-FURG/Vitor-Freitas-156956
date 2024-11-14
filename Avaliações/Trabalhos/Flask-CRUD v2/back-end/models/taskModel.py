from instance.db import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(100), nullable=False)
    checked = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    @classmethod
    def get_by_id(self, task_id):
        """Busca uma tarefa pelo ID."""
        return self.query.get(task_id)
    
    @classmethod
    def get_all(self):
        """Retorna todas as tarefas."""
        return self.query.all()

    @classmethod
    def get_by_user_id(self, user_id):
        """Busca tarefas pelo ID do usuário."""
        return self.query.filter_by(user_id=user_id).all()

    @classmethod
    def create_task(self, title, description, user_id):
        """Cria e insere uma nova tarefa no banco de dados."""
        new_task = self(title=title, description=description, user_id=user_id)
        db.session.add(new_task)
        db.session.commit()
        return new_task
    
    @classmethod
    def delete_task(cls, task_id):
        """Deleta uma tarefa pelo ID."""
        task = cls.get_by_id(task_id)
        if task:
            db.session.delete(task)  # Remove o objeto da sessão
            db.session.commit()      # Confirma a exclusão
            return True
        return False
    
    @classmethod
    def update_task(self, task_id, title=None, description=None, user_id=None, checked=None):
        """Atualiza uma tarefa pelo ID."""
        task = self.get_by_id(task_id)
        if task:
            print(task.checked)
            if title:
                if len(title) > 30:
                    raise ValueError("O título não pode ter mais de 30 caracteres.")
                task.title = title
            if description:
                if len(description) > 100:
                    raise ValueError("A descrição não pode ter mais de 100 caracteres.")
                task.description = description
            if user_id:
                task.user_id = user_id
            if checked is not None:
                task.checked = checked
                
            db.session.commit()  # Confirma as alterações
            return task
        return None
    
    #   Transforma para dicionário.
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "user_id": self.user_id,
            "checked": self.checked
        }