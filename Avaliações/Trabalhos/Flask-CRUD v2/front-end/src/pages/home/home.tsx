import { useEffect, useState } from "react"
import "./home.css"
import { TaskCheck, TaskCreate, TaskDelete, TaskEdit, TaskGetAll } from "../../requests/task.request";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';

interface ITask {
    id: number,
    title: string,
    description: string,
    checked: boolean,
    user_id: number
}

export const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [tasksChecked, setTasksChecked] = useState([]);
    const [toDoOrNot, setToDoOrNot] = useState(true);
    const [taskClicked, setTaskClicked] = useState<ITask>();
    const [modal, setModal] = useState(false);
    const [modalCheck, setModalCheck] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const token = localStorage?.getItem("token")
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    const createTask = (event: any) => {
        event.preventDefault();
        try {
            if (token && title && description) {
                const new_task = TaskCreate(token, title, description)
                console.log(new_task)
                navigate(0)
            }

        } catch {
            console.log('error')
        }
    }

    const checkTask = (event: any) => {
        event.preventDefault();
        try {
            if (token && taskClicked) {
                const checked_task = TaskCheck(token, taskClicked.id)
                console.log(checked_task)
                navigate(0)
            }

        } catch {
            console.log('error')
        }
    }

    const editTask = (event: any) => {
        event.preventDefault();
        try {
            if (token && (title || description) && taskClicked) {
                const updated_task = TaskEdit(token, taskClicked.id, title, description)
                console.log(updated_task)
                navigate(0)
            }

        } catch {
            console.log('error')
        }
    }

    const deleteTask = (event: any) => {
        event.preventDefault();
        try {
            if (token && taskClicked) {
                const deleted_task = TaskDelete(token, taskClicked.id)
                console.log(deleted_task)
                navigate(0)
            }

        } catch {
            console.log('error')
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
            <Modal
                open={modal}
                onClose={() => setModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal">
                    <form className="modal-display" onSubmit={createTask}>
                        <div className="display-form">
                            <h1>Criando Task</h1>
                            <div className="display-inputs">
                                <p>Title</p>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    onChange={(event) => { setTitle(event.target.value) }}
                                    required
                                    placeholder="Digite o título"
                                />
                            </div>
                            <div className="display-inputs">
                                <p>Description</p>
                                <input
                                    id="description"
                                    name="description"
                                    onChange={(event) => { setDescription(event.target.value) }}
                                    required
                                    type="text"
                                    placeholder="Digite a descrição"
                                />
                            </div>
                        </div>

                        <div style={{ width: "100%" }}>
                            <button className="button-form" type="submit">Enviar</button>
                        </div>
                        <div style={{ width: "100%" }}>
                            <button className="button-form-red" onClick={() => setModal(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal
                open={modalCheck}
                onClose={() => setModalCheck(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal">
                    <form className="modal-display" onSubmit={checkTask}>
                        <div className="display-form">
                            <h1>Deseja concluir a task {taskClicked?.title}?</h1>
                        </div>

                        <div style={{ width: "100%" }}>
                            <button className="button-form" type="submit">Enviar</button>
                        </div>
                        <div style={{ width: "100%" }}>
                            <button className="button-form-red" onClick={() => setModalCheck(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal
                open={modalDelete}
                onClose={() => setModalDelete(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal">
                    <form className="modal-display" onSubmit={deleteTask}>
                        <div className="display-form">
                            <h1>Deseja deletar a task {taskClicked?.title}?</h1>
                        </div>

                        <div style={{ width: "100%" }}>
                            <button className="button-form" type="submit">Enviar</button>
                        </div>
                        <div style={{ width: "100%" }}>
                            <button className="button-form-red" onClick={() => setModalDelete(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal
                open={modalEdit}
                onClose={() => setModalEdit(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal">
                    <form className="modal-display" onSubmit={editTask}>
                        <div className="display-form">
                            <h1>Editando a Task {taskClicked?.title}</h1>
                            <div className="display-inputs">
                                <p>Title</p>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    onChange={(event) => { setTitle(event.target.value) }}
                                    placeholder={taskClicked?.title}
                                />
                            </div>
                            <div className="display-inputs">
                                <p>Description</p>
                                <input
                                    id="description"
                                    name="description"
                                    onChange={(event) => { setDescription(event.target.value) }}
                                    type="text"
                                    placeholder={taskClicked?.description}
                                />
                            </div>
                        </div>

                        <div style={{ width: "100%" }}>
                            <button className="button-form" type="submit">Enviar</button>
                        </div>
                        <div style={{ width: "100%" }}>
                            <button className="button-form-red" onClick={() => { setModalEdit(false), setTitle(""), setDescription("") }}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </Modal>
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
                                <li className="task-item">
                                    <span className="task-title">{value.title}</span>
                                    <p className="task-description">{value.description}</p>
                                    <div className="task-actions">
                                        <button className="btn check-btn" onClick={() => { setModalCheck(true), setTaskClicked(value) }}>✔️</button>
                                        <button className="btn edit-btn" onClick={() => { setModalEdit(true), setTaskClicked(value) }}>✏️</button>
                                        <button className="btn delete-btn" onClick={() => { setModalDelete(true), setTaskClicked(value) }}>❌</button>
                                    </div>
                                </li>
                            )
                        }) : null}
                    </ul>
                    <button className="createTask" type="submit" onClick={() => { setModal(true) }}>Criar nova task</button>
                </div>
                :
                <div className="task-container">
                    <h2>Tarefas feitas.</h2>
                    <ul className="task-list">
                        {tasksChecked[0] ? tasksChecked.map((value: any, index: number) => {
                            return (
                                <li className="task-item">
                                    <span className="task-title">{value.title}</span>
                                    <p className="task-description">{value.description}</p>
                                    <div className="task-actions">
                                        <button className="btn delete-btn" onClick={() => { setModalDelete(true), setTaskClicked(value) }}>❌</button>
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
