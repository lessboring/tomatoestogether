type TomatoState = 'break'|'tomato';
type OperationType = 'create' | 'update' | 'delete';

interface CreateOperation {
    op_type: 'create';
    task_id: number;
    parent_id: number;
    index: number;
    title: string;
    body: string;
}

interface UpdateOperation {
    op_type: 'update';
    task_id: number;
    parent_id: number;
    index: number;
    title: string;
    body: string;
}

interface DeleteOperation {
    op_type: 'delete';
    task_id: number;
}

type Operation = CreateOperation | UpdateOperation | DeleteOperation;

interface UserJSON {
    id: number;
    email: string;
    tomato_break_iframe_url: string;
    timezone: string;
}

interface FolderJSON {
    id: number;
    name: string;
    parent: number | null;
    projects?: ProjectJSON[];
}

interface ProjectJSON {
    id: number;
    name: string;
    folder: number | null;
    tasks?: TaskJSON[];
}

interface TaskJSON {
    id: number;
    project: number;
    parent: number | null;
    index: number;
    title: string;
    completed: boolean;
}
