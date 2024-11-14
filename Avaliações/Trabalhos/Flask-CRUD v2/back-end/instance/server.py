from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from instance.db import db
from models.userModel import User
from models.taskModel import Task

app = Flask(__name__, static_folder='styles')

app.config.from_object('instance.config.Config')

jwt = JWTManager(app)

db.init_app(app)

with app.app_context():
    db.create_all()
    
# LOGIN
@app.route('/login', methods = ['POST'])
def login():
    if request.method == 'POST':
        try:
            username = request.get_json().get('username')
            password = request.get_json().get('password')
            
            if not username or not password:
                return jsonify({"Error": "Ausência de dados."}), 400
            
            user = User.get_by_username(username=username)
            
            if user:
                if user.password == password:
                    access_token = create_access_token(identity=user.id)
                    return jsonify({"message": "Logado com sucesso!", "access_token":access_token}), 200
                else:
                    return jsonify({"Error": "Senha errada."}), 400
            else:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "login()", "Linha": "40"}), 500
 
# CRIA CONTA NOVA
@app.route('/register', methods = ['POST'])
def register():
    if request.method == 'POST':
        try:
            name = request.get_json().get('name')
            username = request.get_json().get('username')
            password = request.get_json().get('password')
            if not username or not password or not name:
                return jsonify({"Error": "Ausência de dados."}), 400
            user = User.get_by_username(username=username)
            
            if user:
                return jsonify({"Error": "Nome de usuário já cadastrado."}), 404
            else:
                new_user = User.create_user(name=name, username=username, password=password)
                
                access_token = create_access_token(identity=new_user.id)
                return jsonify({"message": "Cadastro realizado com sucesso!", "access_token":access_token}), 201
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "register()", "Linha": "64"}), 500
 
# TASK GET ALL OU CREATE
@app.route('/task', methods = ['GET', 'POST'])
@jwt_required()
def task():
    
    #   PEGA TODAS AS TASKS
    if request.method == "GET":
        try:
            # VALIDA
            id_user = get_jwt_identity()
            user = User.get_by_id(user_id=id_user)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
                
            tasks = Task.get_by_user_id(user_id=id)
            tasks = [task.to_dict() for task in tasks]
            
            return jsonify({"tasks": tasks}), 200
        
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "task()", "Linha": "83"}), 500
        
    #   CRIA TASK NOVA
    if request.method == 'POST':
        try:
            # VALIDA
            id_user = get_jwt_identity()
            user = User.get_by_id(user_id=id_user)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
            # CRIA NOVA TASK
            title = request.get_json().get('title')
            description = request.get_json().get('description')
        
            if not title or not description:
                return jsonify({"Error": "Ausência de dados."}), 400
            
            new_task = Task.create_task(title=title, description=description, user_id=id)
            
            return jsonify({"message": "Task criada com sucesso!", "task": new_task.to_dict()}), 201
        
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "task()", "Linha": "83"}), 500

# TASK PELO SEU ID
@app.route('/task/<int:id>', methods = ['GET', 'DELETE', 'PUT', 'PATCH'])
@jwt_required()
def taskById(id):
    
    #   PEGA TASK PELO ID
    if request.method == "GET":
        try:
            # VALIDA
            id_user = get_jwt_identity()
            user = User.get_by_id(user_id=id_user)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
            task_by_id = Task.get_by_id(task_id=id)
            
            if task_by_id:
                return jsonify(task_by_id.to_dict()), 200
            else:
                return jsonify({"Error": "Task não encontrada."}), 404
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "taskById()", "Linha": "108"}), 500  
    
    #   EDITA A TASK
    elif request.method == "PUT":
        try:
            # VALIDA
            id_user = get_jwt_identity()
            user = User.get_by_id(user_id=id_user)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
            title = request.get_json().get('title')
            description = request.get_json().get('description')
            print(id)
            updatedTask = Task.update_task(task_id=id, title=title, description=description)
            print(updatedTask)
            if updatedTask:
                return jsonify({"message": "Task editada com sucesso!", "task": updatedTask.to_dict()}), 200
            else:
                return jsonify({"Error": "Task não encontrada."}), 404
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "taskById()", "Linha": "108"}), 500 
    
    #   DÁ O CHECK NA TASK
    elif request.method == "PATCH":
        try:
            # VALIDA
            id_user = get_jwt_identity()
            user = User.get_by_id(user_id=id_user)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
            checkedTask = Task.update_task(task_id=id, checked=True)
            
            if checkedTask:
                return jsonify({"message": "Task concluida com sucesso!", "task": checkedTask.to_dict()}), 200
            else:
                return jsonify({"Error": "Task não encontrada."}), 404
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "taskById()", "Linha": "108"}), 500 
    
    #   DELETA A TASK
    elif request.method == "DELETE":
        try:
            # VALIDA
            id_user = get_jwt_identity()
            user = User.get_by_id(user_id=id_user)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
            task = Task.delete_task(task_id=id)
            
            if task:
                return jsonify({"message": "Task deletada com sucesso!"}), 200
            else:
                return jsonify({"Error": "Task não encontrada."}), 404
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "taskById()", "Linha": "108"}), 500 
    else:
        return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"Método HTTP não é valido.", "Função": "taskById()", "Linha": "108"}), 500 
