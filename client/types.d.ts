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
