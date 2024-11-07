from flask import Flask, request, render_template, session, redirect
from instance.db import db
from models.userModel import User
from models.taskModel import Task

app = Flask(__name__, static_folder='styles')
app.secret_key = "andrezitoprisquito"
app.config['SESSION_PERMANENT'] = True

app.config.from_object('instance.config.Config')

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

@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        print(f"\n USERNAME: {username}\n SENHA: {password}\n")
        if not username or not password:
            return render_template('login.html')
        
        user = User.get_by_username(username=username)
        print(user)
        if user:
            if user.password == password:
                session['name'] = user.name
                session['token'] = user.id
                return redirect('/')
            else:
                error = "Senha errada."
                return render_template('login.html', error=error)
        else:
            error = "Usuário não encontrado."
            return render_template('login.html', error=error)
            
    elif request.method == "GET":
        return render_template('login.html')
    
@app.route('/register', methods = ['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form.get('name')
        username = request.form.get('username')
        password = request.form.get('password')
        if not username or not password or not name:
            return render_template('register.html')
        user = User.get_by_username(username=username)
        print(user)
        if user:
            error = "Nome de usuário já cadastrado."
            return render_template('register.html', error=error)
        else:
            new_user = User.create_user(name=name, username=username, password=password)
            print(f"NOVO USUARIO:\n{new_user}")
            session['token'] = new_user.id
            session['name'] = new_user.name
            return redirect('/')
            
    elif request.method == "GET":
        return render_template('register.html')

@app.route('/checkedTasks', methods = ['GET', 'POST'])
def homeCheckedTasks():
    if request.method == "GET":
        if 'token' not in session:
            return redirect("/login")
        
        id = session["token"]
        name = session["name"]
        
        tasks = Task.get_by_user_id(user_id=id)
        print(f"TASKS:\n {tasks}\n")
        
        return render_template('home.html', name=name, tasks=tasks, checkedTasks=True)

@app.route('/home', methods = ['GET', 'POST'])
def home():
    if request.method == 'POST':
        return redirect('/')
            
    elif request.method == "GET":
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