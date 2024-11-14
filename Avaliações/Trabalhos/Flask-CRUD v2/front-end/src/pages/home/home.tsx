import { useEffect, useState } from "react"
import "./home.css"
import { TaskCreate, TaskGetAll } from "../../requests/task.request";
import { useNavigate } from "react-router-dom";
import Modal from '@mui/material/Modal';

export const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [tasksChecked, setTasksChecked] = useState([]);
    const [toDoOrNot, setToDoOrNot] = useState(true);
    const [taskClicked, setTaskClicked] = useState(true);
    const [modal, setModal] = useState(false);
    const [modalCheck, setModalCheck] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const token = localStorage?.getItem("token")
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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


    const handleCallGets = async () => {
        try {
            if (token) {
                const requestTasks = await TaskGetAll(token)
                console.log(requestTasks)
                setTasks(requestTasks)
            }

        } catch {
            console.log("error home useEffect")
        }
    }
    const onClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        handleCallGets()
    }, [])

    return (
        <body>
            <Modal
                open={modal}
                onClose={() => { setModal(false), onClose() }}
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
                    </form>
                </div>
            </Modal>
            <Modal
                open={modal}
                onClose={() => { setModal(false), onClose() }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modal">
                    <form className="modal-display" onSubmit={createTask}>
                        <div className="display-form">
                            <h1>Deseja concluir a task {taskClicked}?</h1>
                        </div>

                        <div style={{ width: "100%" }}>
                            <button className="button-form" type="submit">Enviar</button>
                        </div>
                        <div style={{ width: "100%" }}>
                            <button className="button-form-red" type="submit">Não</button>
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
                        {tasks ? tasks.map((value: any, index: number) => {
                            return (
                                <li className="task-item">
                                    <span className="task-title">{value.title}</span>
                                    <p className="task-description">{value.description}</p>
                                    <div className="task-actions">
                                        <button className="btn check-btn" onClick={() => { setModalCheck(true), setTaskClicked(value.title) }}>✔️</button>
                                        <button className="btn edit-btn" onClick={() => { setModalEdit(true), setTaskClicked(value.title) }}>✏️</button>
                                        <button className="btn delete-btn" onClick={() => { setModalDelete(true), setTaskClicked(value.title) }}>❌</button>
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
                        {tasks ? tasks.map((value: any, index: number) => {
                            return (
                                <li className="task-item">
                                    <span className="task-title">{value.title}</span>
                                    <p className="task-description">{value.description}</p>
                                    <div className="task-actions">
                                        <a href="/task/delete/{{task.id}}">
                                            <button className="btn delete-btn">❌</button>
                                        </a>
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
