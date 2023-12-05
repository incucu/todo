import { writable } from 'svelte/store';
import type { Task, List } from '../types/types';

class TodoStore {
    private store;
    private key = 'lists';

    constructor(defaultLists: { lists: List[] }) {
        const initialData = this.getFromLocalStorage(this.key, defaultLists);
        this.store = writable(initialData);

        // Let's automatically update localStorage when store changes
        this.store.subscribe(value => {
            this.updateLocalStorage(this.key, value);
        });
    }

    private updateLocalStorage(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    private getFromLocalStorage(key: string, defaultValue: any): any {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    }

    private updateTask(listId: number, taskId: number, updatedTask: Partial<Task>, sortKey?: 'createdAt' | 'completedAt') {
        this.store.update(store => {
            const listIndex = store.lists.findIndex(list => list.id === Number(listId));
            if (listIndex === -1) return store; // list not found

            const updatedLists = [...store.lists];
            const taskIndex = updatedLists[listIndex].tasks.findIndex(task => task.id === taskId);
            if (taskIndex === -1) return store; // task not found

            // Let's update the task with provided values
            updatedLists[listIndex].tasks[taskIndex] = { 
                ...updatedLists[listIndex].tasks[taskIndex],
                ...updatedTask 
            };

           // Let's sort tasks based on the sortKey
           if (sortKey) {
                updatedLists[listIndex].tasks.sort((a, b) => {
                    if (sortKey === 'completedAt') {
                        // Let's sort only if both tasks are done
                        if (a.done && b.done) {
                            const dateA = a[sortKey] ? new Date(a[sortKey]).getTime() : 0;
                            const dateB = b[sortKey] ? new Date(b[sortKey]).getTime() : 0;
                            return dateB - dateA; // newest on top
                        }
                        // If only one task is done, it should come after the not done task
                        if (a.done) return 1;
                        if (b.done) return -1;
                        // If neither is done, keep their original order
                        return 0;
                    } else {
                        const dateA = a[sortKey] ? new Date(a[sortKey]).getTime() : 0;
                        const dateB = b[sortKey] ? new Date(b[sortKey]).getTime() : 0;
                        return dateB - dateA;
                    }
                });
            }

            return { ...store, lists: updatedLists };
        });
    }

    addTask(listId: number, taskText: string) {
        this.store.update(store => {
            const listIndex = store.lists.findIndex(list => list.id === Number(listId));
            if (listIndex === -1) return store; // list not found

            const newTask: Task = {
                id: Date.now(),
                text: taskText,
                checked: false,
                done: false,
                createdAt: Date().toLocaleString(),
                completedAt: null
            };

            const updatedLists = [...store.lists];
            updatedLists[listIndex].tasks = [newTask, ...updatedLists[listIndex].tasks];

            return { ...store, lists: updatedLists };
        });
    }

    completeTask(listId: number, taskId: number) {
        this.updateTask(listId, taskId, { done: true, completedAt: new Date().toLocaleString() }, 'completedAt');
    }

    unDoneTask(listId: number, taskId: number) {
        this.updateTask(listId, taskId, { done: false, checked: false, completedAt: null }, 'createdAt');
    }

    updateTaskOrder(listId: number, draggingItemIndex: number, hoveredItemIndex: number) {
        this.store.update(store => {
            const listIndex = store.lists.findIndex(list => list.id === Number(listId));
            if (listIndex === -1) return store; // list not found

            const updatedLists = [...store.lists];
            const tasks = [...updatedLists[listIndex].tasks];
    
            // Let's swap the tasks
            [tasks[draggingItemIndex], tasks[hoveredItemIndex]] = [tasks[hoveredItemIndex], tasks[draggingItemIndex]];
            
            // Let's update the list with the new tasks order
            updatedLists[listIndex].tasks = tasks;
    
            return { ...store, lists: updatedLists };
        });
    }

    deleteTask(listId: number, taskId: number) {
        this.store.update(store => {
            const listIndex = store.lists.findIndex(list => list.id === Number(listId));
            if (listIndex === -1) return store; // list not found

            const updatedLists = [...store.lists];
            // Let's filter out the given task
            updatedLists[listIndex].tasks = updatedLists[listIndex].tasks.filter(task => task.id !== taskId);

            return { ...store, lists: updatedLists };
        });
    }

    addList(listTitle: string) {
        this.store.update(store => {
            const newList: List = {
                id: Date.now(),
                title: listTitle,
                createdAt: new Date().toLocaleString(),
                tasks: []
            };
            return { ...store, lists: [newList, ...store.lists] };
        });
    }

    formatTaskDate(date : String) {
        const userLocale = navigator.language;

        // Let's format createdAt/completedAt date according to the browser locale for the output
        return new Date(date).toLocaleDateString(userLocale, {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit'
        });  
    }

    // Let's expose the subscribe method
    // It takes a callback function as a parameter, which will be executed every time the state changes.
    // A callback function should handle the new state of the store.
    subscribe(callback: any) {
        return this.store.subscribe(callback);
    }
}

const defaultLists: { lists: List[] } = {
    lists: [
        {
            id: 1,
            title: 'User complaints',
            createdAt: '2023-11-26T09:00:00',
            tasks: [
                { id: 1, text: 'Lists cannot be deleted, that\'s not good :( Please implement it!', checked: false, done: false, createdAt: '2024-07-14T23:46:58', completedAt: null },
                { id: 2, text: 'Lists cannot be ordered either...', checked: false, done: false, createdAt: '2024-02-15T21:31:38', completedAt: null },
                { id: 3, text: 'My friend can\'t see updates to a shared list; are we missing a backend component?', checked: false, done: false, createdAt: '2023-09-18T19:16:18', completedAt: null },
                { id: 4, text: 'This app looks awful on my iPhone', checked: false, done: false, createdAt: '2023-04-21T17:00:58', completedAt: null },
            ]
        },
        {
            id: 2,
            title: 'Shop list',
            createdAt: '2023-11-29T15:20:00',
            tasks: [
                { id: 1, text: 'Milk', checked: false, done: false, createdAt: '2022-11-26T11:31:06', completedAt: null },
                { id: 2, text: 'Apples', checked: false, done: false, createdAt: '2022-11-23T00:01:37', completedAt: null },
                { id: 3, text: 'Bread', checked: false, done: false, createdAt: '2022-11-22T17:00:13', completedAt: null },
                { id: 4, text: 'Skeyl subscription', checked: false, done: false, createdAt: '2022-11-22T15:12:41', completedAt: null },
                { id: 5, text: 'Codici Masserie Appassimento Primitivo 2020', checked: false, done: false, createdAt: '2022-11-22T14:45:38', completedAt: null },
            ]
        },
    ]
};

export const todoStore = new TodoStore(defaultLists);