import { writable } from 'svelte/store';

interface Task {
    id: number;
    text: string;
    checked: boolean;
    done: boolean;
    createdAt: string;
    completedAt: string | null;
    timerId?: number;
}

interface List {
    id: number;
    title: string;
    createdAt: string;
    tasks: Task[];
}

const lists: { lists: List[] } = {
    lists: [
        {
            id: 1,
            title: 'Personal To-Do List',
            createdAt: '26/11/2023, 09:00:00',
            tasks: [
                { id: 1, text: 'The first task is always the most difficult, because you have to start from the beginning', checked: false, done: false, createdAt: '26/11/2023, 14:45:38', completedAt: null },
                { id: 2, text: 'Yeah, the second task is an easy one!', checked: false, done: false, createdAt: '26/11/2023, 12:15:01', completedAt: null },
                { id: 3, text: 'Do you really need a third one?', checked: false, createdAt: '22/11/2023, 06:11:21', done: false, completedAt: null },
                { id: 4, text: 'The 4th tasks!', checked: false, createdAt: '12/01/2022, 15:36:33', done: false, completedAt: null },
                { id: 5, text: 'Yet another task!', checked: false, createdAt: '23/12/201, 19:16:53', done: false, completedAt: null },
            ]
        },
        {
            id: 2,
            title: 'Purchase list',
            createdAt: '29/11/2023, 15:20:00',
            tasks: [
                { id: 1, text: 'Milk', checked: false, done: false, createdAt: '22/11/2022, 06:11:21', completedAt: null },
                { id: 2, text: 'Apples', checked: false, done: false, createdAt: '22/11/2022, 02:11:21', completedAt: null },
                { id: 3, text: 'Bread', checked: false, done: false, createdAt: '22/11/2022, 04:11:21', completedAt: null },
            ]
        },
    ]
};

export const todoStore = writable(lists);