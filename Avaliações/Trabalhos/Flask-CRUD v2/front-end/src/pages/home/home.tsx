import { useEffect, useState } from "react"
import "./home.css"
import { TaskCheck, TaskCreate, TaskDelete, TaskEdit, TaskGetAll } from "../../requests/task.request";
import { useNavigate } from "react-router-dom";
import { ITask, TypeCrud } from "../../interfaces/interfaces";
import { ModalCrud } from "../../components/ModalCrud/modalCrud";

export const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [tasksChecked, setTasksChecked] = useState([]);
    const [toDoOrNot, setToDoOrNot] = useState(true);
    const [taskClicked, setTaskClicked] = useState<ITask>();
    const [typeModalCrud, setTypeModalCrud] = useState<TypeCrud>(TypeCrud.NONE);

    const token = localStorage?.getItem("token")
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    const createTask = (title?: string, description?: string) => {
        console.log(`DEBUG ${title}${description}`)
        try {
            if (token && title && description) {
                const new_task = TaskCreate(token, title, description)
                console.log(new_task)
                navigate(0)
            }
            return true

        } catch {
            console.log('error')
            return false
        }
    }

    const checkTask = () => {
        try {
            if (token && taskClicked) {
                const checked_task = TaskCheck(token, taskClicked.id)
                console.log(checked_task)
                navigate(0)
            }
            return true

        } catch {
            console.log('error')
            return false
        }
    }

    const editTask = (title?: string, description?: string) => {
        console.log(title, description)
        try {
            if (token && (title || description) && taskClicked) {
                const updated_task = TaskEdit(token, taskClicked.id, title, description)
                console.log(updated_task)
                navigate(0)
            }
            return true

        } catch {
            console.log('error')
            return false
        }
    }

    const deleteTask = () => {
        try {
            if (token && taskClicked) {
                const deleted_task = TaskDelete(token, taskClicked.id)
                console.log(deleted_task)
                navigate(0)
            }
            return true

        } catch {
            console.log('error')
            return false
        }
    }


    const handleCallGets = async () => {
        try {
            if (token) {
                const requestTasks = await TaskGetAll(token)
                console.log(requestTasks)
                const listChecked = requestTasks.filter((task: ITask) => task.checked)

                const listNotChecked = requestTasks.filter((task: ITask) => !task.checked)

                setTasks(listNotChecked)
                setTasksChecked(listChecked)
            }

        } catch {
            console.log("error home useEffect")
        }
    }

    useEffect(() => {
        handleCallGets()
    }, [])


    return (
        <body>
            <ModalCrud type={typeModalCrud} taskClicked={taskClicked} create_function={createTask} edit_function={editTask} check_function={checkTask} delete_function={deleteTask} stateTypeModalCrud={setTypeModalCrud} />
            <div className="bar">
                <div className="pages" onClick={() => setToDoOrNot(true)}><p>A Fazer</p></div>
                <div className="pages" onClick={() => setToDoOrNot(false)}><p>Feitas</p></div>
                <div className="logout" onClick={handleLogout}><p>Logout</p></div>
            </div>
            {toDoOrNot ?
                <div className="task-container">
                    <h2>Lista de Tarefas</h2>
                    <ul className="task-list">
                        {tasks[0] ? tasks?.map((value: any, index: number) => {
                            return (
                                <li className="task-item" key={index}>
                                    <span className="task-title">{value.title}</span>
                                    <p className="task-description">{value.description}</p>
                                    <div className="task-actions">
                                        <button className="btn check-btn" onClick={() => { setTypeModalCrud(TypeCrud.CHECK), setTaskClicked(value) }}>✔️</button>
                                        <button className="btn edit-btn" onClick={() => { setTypeModalCrud(TypeCrud.EDIT), setTaskClicked(value) }}>✏️</button>
                                        <button className="btn delete-btn" onClick={() => { setTypeModalCrud(TypeCrud.DELETE), setTaskClicked(value) }}>❌</button>
                                    </div>
                                </li>
                            )
                        }) : null}
                    </ul>
                    <button className="createTask" onClick={() => { setTypeModalCrud(TypeCrud.CREATE) }}>Criar nova task</button>
                </div>
                :
                <div className="task-container">
                    <h2>Tarefas feitas.</h2>
                    <ul className="task-list">
                        {tasksChecked[0] ? tasksChecked.map((value: any, index: number) => {
                            return (
                                <li className="task-item" key={index}>
                                    <span className="task-title">{value.title}</span>
                                    <p className="task-description">{value.description}</p>
                                    <div className="task-actions">
                                        <button className="btn delete-btn" onClick={() => { setTypeModalCrud(TypeCrud.DELETE), setTaskClicked(value) }}>❌</button>
                                    </div>
                                </li>
                            )
                        }) : null}
                    </ul>
                </div>
            }
        </body>
    )
}
