type CompletedByUser = {
  email: string;
  name: string;
};

export class TodoListItem {
  id: number;
  task: string;
  completed: boolean;
  todo_list_id: number;
  completed_by: number | null;
  completed_date: string | null;
  updated_at: string;
  due_date: string | null;
  completed_by_user: CompletedByUser | null;

  constructor(
    id: number,
    task: string,
    completed: boolean = false,
    todo_list_id: number,
    completed_by: number | null = null,
    completed_date: string | null = null,
    updated_at: string = new Date().toISOString(),
    due_date: string | null = null,
    completed_by_user: CompletedByUser | null = null
  ) {
    this.id = id;
    this.task = task;
    this.completed = completed;
    this.todo_list_id = todo_list_id;
    this.completed_by = completed_by;
    this.completed_date = completed_date;
    this.updated_at = updated_at;
    this.due_date = due_date;
    this.completed_by_user = completed_by_user;
  }
}
