import { useEffect, useState } from 'react'
import { ITask, TypeCrud } from '../../interfaces/interfaces'
import { Modal } from '@mui/material'


interface ModalCrudProps {
  type: TypeCrud;
  create_function: (title?: string, description?: string) => boolean
  edit_function: (title?: string, description?: string) => boolean
  delete_function: () => boolean
  check_function: () => boolean
  taskClicked?: ITask;
  stateTypeModalCrud: (value: React.SetStateAction<TypeCrud>) => void
}

export const ModalCrud = ({ type, create_function, edit_function, delete_function, check_function, taskClicked, stateTypeModalCrud }: ModalCrudProps) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalCreate, setModalCreate] = useState(false);
  const [modalCheck, setModalCheck] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  useEffect(() => {
    switch (type) {
      case 'CREATE':
        console.log('oi')
        setModalCreate(true)
        break;
      case 'EDIT':
        setModalEdit(true)
        break;
      case 'CHECK':
        setModalCheck(true)
        break;
      case 'DELETE':
        setModalDelete(true)
        break
      default:
        break
    }
  }, [type])

  return (
    <>
      {type == "CREATE" ?
        <Modal
          open={modalCreate}
          onClose={() => setModalCreate(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="modal">
            <div className="modal-display" >
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
                <button className="button-form" onClick={() => create_function(title, description)}>Enviar</button>
              </div>
              <div style={{ width: "100%" }}>
                <button className="button-form-red" onClick={() => { setModalCreate(false), stateTypeModalCrud(TypeCrud.NONE) }}>Cancelar</button>
              </div>
            </div>
          </div>
        </Modal>
        : type == "CHECK" ?
          <Modal
            open={modalCheck}
            onClose={() => setModalCheck(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <div className="modal">
              <div className="modal-display">
                <div className="display-form">
                  <h1>Deseja concluir a task {taskClicked?.title}?</h1>
                </div>

                <div style={{ width: "100%" }}>
                  <button className="button-form" onClick={() => check_function()}>Enviar</button>
                </div>
                <div style={{ width: "100%" }}>
                  <button className="button-form-red" onClick={() => { setModalCheck(false), stateTypeModalCrud(TypeCrud.NONE) }}>Cancelar</button>
                </div>
              </div>
            </div>
          </Modal>
          : type == "DELETE" ?
            <Modal
              open={modalDelete}
              onClose={() => setModalDelete(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <div className="modal">
                <div className="modal-display" >
                  <div className="display-form">
                    <h1>Deseja deletar a task {taskClicked?.title}?</h1>
                  </div>

                  <div style={{ width: "100%" }}>
                    <button className="button-form" onClick={() => delete_function()}>Enviar</button>
                  </div>
                  <div style={{ width: "100%" }}>
                    <button className="button-form-red" onClick={() => { setModalDelete(false), stateTypeModalCrud(TypeCrud.NONE) }}>Cancelar</button>
                  </div>
                </div>
              </div>
            </Modal>
            : type == "EDIT" ?
              <Modal
                open={modalEdit}
                onClose={() => setModalEdit(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div className="modal">
                  <div className="modal-display">
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
                      <button className="button-form" onClick={() => edit_function(title, description)}>Enviar</button>
                    </div>
                    <div style={{ width: "100%" }}>
                      <button className="button-form-red" onClick={() => { setModalEdit(false), setTitle(""), setDescription(""), stateTypeModalCrud(TypeCrud.NONE) }}>Cancelar</button>
                    </div>
                  </div>
                </div>
              </Modal>
              : null}
    </>
  )
}
