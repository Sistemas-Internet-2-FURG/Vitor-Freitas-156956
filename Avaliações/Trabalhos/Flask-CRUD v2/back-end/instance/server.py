from flask import Flask, request, render_template, session, redirect, jsonify
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
    

@app.route('/login', methods = ['POST'])
def login():
    if request.method == 'POST':
        try:
            username = request.get_json().get('username')
            password = request.get_json().get('password')
            print(f"\n USERNAME: {username}\n SENHA: {password}\n")
            if not username or not password:
                return jsonify({"Error": "Ausência de dados."}), 400
            user = User.get_by_username(username=username)
            if user:
                print(user)
                if user.password == password:
                    access_token = create_access_token(identity=user.id)
                    return jsonify({"message": "Logado com sucesso!", "access_token":access_token}), 200
                else:
                    return jsonify({"Error": "Senha errada."}), 400
            else:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "login()", "Linha": "40"}), 500
 
    
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
            print(user)
            if user:
                return jsonify({"Error": "Nome de usuário já cadastrado."}), 404
            else:
                new_user = User.create_user(name=name, username=username, password=password)
                print(f"NOVO USUARIO:\n{new_user}")
                access_token = create_access_token(identity=new_user.id)
                return jsonify({"message": "Cadastro realizado com sucesso!", "access_token":access_token}), 201
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "register()", "Linha": "64"}), 500
 
    
@app.route('/task', methods = ['GET', 'POST'])
@jwt_required()
def task():
    if request.method == "GET":
        try:
            # VALIDA
            id = get_jwt_identity()
            user = User.get_by_id(user_id=id)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
                
            # PEGA TODAS TASKS
            tasks = Task.get_by_user_id(user_id=id)
            
            return jsonify({"tasks": tasks}), 200
        
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "task()", "Linha": "83"}), 500
        
    if request.method == 'POST':
        try:
            # VALIDA
            id = get_jwt_identity()
            user = User.get_by_id(user_id=id)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
            # CRIA NOVA TASK
            title = request.get_json().get('title')
            description = request.get_json().get('description')
        
            if not title or not description:
                return jsonify({"Error": "Ausência de dados."}), 400
            
            new_task = Task.create_task(title=title, description=description, user_id=id)
            print(new_task)
            
            return jsonify({"message": "Task criada com sucesso!"}), 201
        
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "task()", "Linha": "83"}), 500

@app.route('/task/<int:id>', methods = ['GET'])
@jwt_required()
def taskById(id):
    if request.method == "GET":
        try:
            # VALIDA
            id = get_jwt_identity()
            user = User.get_by_id(user_id=id)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
            task_by_id = Task.get_by_id(task_id=id)
            if task_by_id:
                return jsonify({"task": task_by_id}), 201
            else:
                return jsonify({"Error": "Task não encontrada."}), 404
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "taskById()", "Linha": "108"}), 500  

@app.route('/task/check/<int:id>', methods = ['POST'])
def taskCheck(id):
    if request.method == "GET":
        try:
            # VALIDA
            id = get_jwt_identity()
            user = User.get_by_id(user_id=id)
            if not user:
                return jsonify({"Error": "Usuário não encontrado."}), 404
            
            updatedTask = Task.update_task(task_id=id, checked=True)
            
            return jsonify({"message": "Task concluida com sucesso!"}), 200
        
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "taskCheck()", "Linha": "129"}), 500

@app.route('/task/edit/<int:id>', methods = ['POST'])
def taskEdit(id):
    if request.method == "POST":
        title = request.form.get('title')
        description = request.form.get('description')
        task = Task.update_task(task_id=id, title=title, description=description)
        if task:
            return redirect("/home")
        else:
            return render_template("500.html")
    return redirect("/home")

@app.route('/task/delete/<int:id>', methods = ['GET', 'POST'])
def taskDelete(id):
    if request.method == "GET":
        task = Task.get_by_id(task_id=id)
        return render_template("deleteTask.html", task=task)
    
    if request.method == "POST":
        task = Task.delete_task(task_id=id)
        if task:
            return redirect("/home")
        else:
            return render_template("500.html")
    return redirect("/home")
