export interface Task {
    id: number;
    text: string;
    checked: boolean;
    done: boolean;
    createdAt: string;
    completedAt: string | null;
    timerId?: number;
}

export interface List {
    id: number;
    title: string;
    createdAt: string;
    tasks: Task[];
}