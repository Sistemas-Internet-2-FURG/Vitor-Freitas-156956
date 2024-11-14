export interface ITask {
    id: number,
    title: string,
    description: string,
    checked: boolean,
    user_id: number
}

export enum TypeCrud {
    CREATE = "CREATE",
    EDIT = "EDIT",
    CHECK = "CHECK",
    DELETE = "DELETE",
    NONE = "NONE"
  }