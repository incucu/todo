<script lang="ts">
    import { onMount } from 'svelte';
    import Sidebar from '../components/Sidebar.svelte';
    import { showDates } from '../stores/stateStore';

    let addTaskInput: HTMLInputElement;

    onMount(() => {
        addTaskInput.focus();
    });

    interface Task {
        id: number;
        text: string;
        checked: boolean;
        done: boolean;
        createdAt: string | null;
        completedAt: string | null;
        timerId?: number;
    }

    let tasks: Task[] = [
        { id: 1, text: 'The first task is always the most difficult, because you have to start from the beginning', checked: false, done: false, createdAt: '26/11/2023, 14:45:38', completedAt: null },
        { id: 2, text: 'Yeah, the second task is an easy one!', checked: false, done: false, createdAt: '26/11/2023, 12:15:01', completedAt: null },
        { id: 3, text: 'Do you really need a third one?', checked: false, createdAt: '22/11/2023, 06:11:21', done: false, completedAt: null },
        { id: 4, text: 'The 4th tasks!', checked: false, createdAt: '12/01/2022, 15:36:33', done: false, completedAt: null },
        { id: 5, text: 'Yet another task!', checked: false, createdAt: '23/12/201, 19:16:53', done: false, completedAt: null },
    ];

    function toggleDates(): void {
        $showDates.update(value => !value);
    }

    let draggingItem: Task | null = null;
    let draggingItemId: number | null = null;
    let draggingItemIndex: number | null = null;
    let hoveredItemIndex : number | null = null;

    $: if (draggingItemIndex != null && hoveredItemIndex != null && draggingItemIndex != hoveredItemIndex) {
        // swap items
        [tasks[draggingItemIndex], tasks[hoveredItemIndex]] = [tasks[hoveredItemIndex], tasks[draggingItemIndex]];
        draggingItemIndex = hoveredItemIndex;
    }

    // Function to handle when a task is checked
    function startTaskTimer(task: Task, index: number): void {
        task.timerId = window.setTimeout(() => {
            completeTask(index);
        }, 500);
    }

    // Function to complete the task and move it to the done list
    function completeTask(index: number): void {
        clearTimeout(tasks[index].timerId);
        tasks[index].done = true;
        tasks[index].completedAt = new Date().toLocaleString();

        // Sort the tasks array by the completedAt property in descending order for done tasks
        tasks = tasks.slice().sort((a, b) => {
            // Both tasks are done, compare their completedAt timestamps
            if (a.done && b.done) {
                const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                return dateB - dateA;
            }
            // If only one task is done, it should come after the not done task
            if (a.done) return 1;
            if (b.done) return -1;
            // If neither task is done, keep their original order
            return 0;
        });
    }

    // Function to handle when a task is unchecked
    function cancelTaskTimer(index: number): void {
        clearTimeout(tasks[index].timerId);
    }

    function markAsUnDone(taskId: number): void {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if(taskIndex !== -1) {
            tasks[taskIndex].done = false;
            tasks[taskIndex].checked = false;
            tasks[taskIndex].completedAt = null;
            const [task] = tasks.splice(taskIndex, 1);
            tasks.unshift(task); // Add the task to the top of the array
        }
    }

    function handleDragStart(event: DragEvent, task: Task, index: number): void {
        draggingItem = task;
        draggingItemIndex = index;
        draggingItemId = task.id;
    }

    function handleDragOver(event: DragEvent, index: number): void {
        event.preventDefault(); // Necessary to allow dropping
        hoveredItemIndex = index;
    }

    function handleDragEnd(): void {
        draggingItemId = null;
        hoveredItemIndex = null;
    }
</script>

<style>
    :global(html){
        background-color: #4A5568;
    }
    :global(.placeholder) {
        height: 2rem;
        background-color: #f0f0f0;
        margin: 0.5rem 0;
        border: 2px dashed #ccc;
    }

    .dragging {
        opacity: 0.5;
    }

    .item {
        display: flex; /* Establish flex container */
        align-items: center; /* Center items vertically */
        padding: 10px;
        margin-bottom: 10px;
        background-color: white;
        cursor: grab;
    }

    .checkbox-container {
        /* Container for the checkbox, keeping it aligned and a fixed size */
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    .checkbox {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        margin-right: 14px;
    }
    
    .text-container {
        flex-grow: 1;
    }

    .date-container{
        height: 12px;
    }

    .progress-bar-container {
        position: relative;
        width: 100%;
        height: 4px;
        background-color: #f0f0f0;
        margin-top: 8px;
    }

    .progress-bar-container-no-dates {
        position: relative;
        width: 100%;
        height: 4px;
        background-color: #f0f0f0;
        margin-top: 4px;
        margin-bottom: -8px;
    }

    .progress-bar {
        position: absolute;
        height: 100%;
        background-color: orange;
        animation: moveAcross .5s linear forwards;
    }

    @keyframes moveAcross {
        from { width: 0; }
        to { width: 100%; }
    }
</style>

<Sidebar />

<div class="pl-64">
    <div class="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16 border-t-2 border-gray-100">
        <div class="px-4 py-2">
            <h1 class="text-gray-800 font-bold text-2xl uppercase">To-Do List</h1>
        </div>
        <div class="w-full max-w-xl mx-auto px-4 py-2">
            <div class="flex items-center border-b-2 border-teal-500 py-2">
                <input
                    bind:this={addTaskInput}
                    class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                    type="text" placeholder="Add a task">
                <button
                    class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                    type="button">
                    Add
                </button>
            </div>
        </div>
        <ul class="divide-y divide-gray-200 px-4">
            {#each tasks as task, index (task.id)}
                {#if !task.done}
                    <li class="py-4 flex flex-col justify-between items-start group to-do-list-item {draggingItemId === task.id ? 'dragging' : ''}"
                        draggable="true"
                        on:dragstart={(event) => handleDragStart(event, task, index)}
                        on:dragover={(event) => handleDragOver(event, index)}
                        on:dragend={handleDragEnd}>
                        <div class="checkbox-container w-full">
                            <input 
                                id={task.id} 
                                type="checkbox" 
                                class="checkbox h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                                bind:checked={task.checked} on:change={task.checked ? () => startTaskTimer(task, index) : () => cancelTaskTimer(index)}
                            >
                            <div class="text-container">
                                <label for={task.id} class="block text-gray-900">
                                    <span class="text-g font-medium">{task.text}</span>
                                </label>
                            </div>
                        </div>
                        {#if task.checked && $showDates}
                            <div class="progress-bar-container">
                                <div class="progress-bar"></div>
                            </div>
                        {:else if task.checked && !$showDates}
                            <div class="progress-bar-container-no-dates">
                                <div class="progress-bar"></div>
                            </div>
                        {:else if $showDates}
                            <div class="date-container">
                                <span class="text-gray-400 text-xs">Added: {task.createdAt}</span>
                            </div>
                        {/if}
                    </li>
                {/if}
            {/each}
        </ul>
    </div>
</div>

{#if tasks.some(task => task.done)}
    <!-- Done List -->
    <div class="pl-64">
        <div class="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16 border-t-2 border-gray-100">
            <div class="px-4 py-2">
                <h1 class="text-gray-800 font-bold text-2xl uppercase">Done List</h1>
            </div>
            <ul class="divide-y divide-gray-200 px-4">
                {#each tasks as task (task.id)}
                    <!-- Only display tasks that are done -->
                    {#if task.done}
                        <li class="py-4 flex justify-between items-center group">
                            <div class="text-container">
                                <span class="block text-gray-900 font-medium">{task.text}</span>
                                {#if $showDates}
                                    <span class="text-gray-400 text-xs">Added: {task.createdAt}  |  Completed: {task.completedAt}</span>
                                {/if}
                            </div>
                            <!-- Button to mark task as done (can also be a checkbox) -->
                            <button
                                class="text-xs text-white bg-teal-500 hover:bg-teal-700 px-2 py-1 rounded"
                                on:click={() => markAsUnDone(task.id)}>
                                Not&nbsp;Done
                            </button>
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
{/if}