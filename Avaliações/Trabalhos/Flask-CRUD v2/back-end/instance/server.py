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
    
    
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.route('/')
def main():
    if 'token' in session:
        return redirect("/home")
    return redirect("/login")


@app.route('/logout', methods = ['GET', 'POST'])
def logout():
    if request.method == 'POST':
        del session['token']
        del session['name']
        return redirect('/')
    elif request.method == "GET":
        return render_template("logout.html")

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
                    access_token = create_access_token(identity=user.username)
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
                access_token = create_access_token(identity=username)
                return jsonify({"message": "Cadastro realizado com sucesso!", "access_token":access_token}), 201
            
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "register()", "Linha": "64"}), 500
 

@app.route('/checkedTasks/<int:id>', methods = ['GET'])
@jwt_required()
def homeCheckedTasks(id):
    if request.method == "GET":
        try:
            token = get_jwt_identity()
            print(token)
            tasks = Task.get_by_user_id(user_id=id)
            print(f"TASKS:\n {tasks}\n")
            
            return jsonify({"tasks": tasks, "access_token": token}), 200
        
        except Exception as e:
            return jsonify({"Error": f"Erro interno do servidor.", "Descrição": f"{e}", "Função": "homeCheckedTasks()", "Linha": "88"}), 500

@app.route('/home', methods = ['GET', 'POST'])
def home(): 
    if request.method == "GET":
        if 'token' not in session:
            return redirect("/login")
        
        id = session["token"]
        name = session["name"]
        
        tasks = Task.get_by_user_id(user_id=id)
        print(f"TASKS:\n {tasks}\n")
        
        return render_template('home.html', name=name, tasks=tasks)
    
@app.route('/task/check/<int:id>', methods = ['GET', 'POST'])
def taskCheck(id):
    if request.method == "GET":
        print('oi')
        updatedTask = Task.update_task(task_id=id, checked=True)
        print(updatedTask.checked)
    return redirect("/home")

@app.route('/task/edit/<int:id>', methods = ['GET', 'POST'])
def taskEdit(id):
    if request.method == "GET":
        task = Task.get_by_id(task_id=id)
        return render_template("editTask.html", task=task)
    
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

@app.route('/task', methods = ['GET', 'POST'])
def task():
    if 'token' not in session:
        return redirect("/home")
    if request.method == "GET":
        return render_template("registerTask.html")
    if request.method == 'POST':
        id = session["token"]
        title = request.form.get('title')
        description = request.form.get('description')
       
        if not title or not description:
            return render_template('registerTask.html', error="Erro ao preencher registro.")
        new_task = Task.create_task(title=title, description=description, user_id=id)
        print(new_task)
        
        return redirect("/home")
    return redirect("/home")