<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { todoStore } from '../stores/todoStore';
    import { showDates } from '../stores/stateStore';

    let addTaskInput: HTMLInputElement;
    onMount(() => {
        addTaskInput.focus();
    });
    
    $: currentId = $page.params.id;
    $: list = $todoStore.lists.find(list => list.id.toString() === currentId) || {};
    $: tasks = list.tasks || [];

    //setTimeout(() => console.log(tasks), 1000);

    let draggingItem: Task | null = null;
    let draggingItemId: number | null = null;
    let draggingItemIndex: number | null = null;
    let hoveredItemIndex : number | null = null;

    $: if (draggingItemIndex != null && hoveredItemIndex != null && draggingItemIndex != hoveredItemIndex) {
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
            // If neither is done, keep their original order
            return 0;
        });

        // Let's update the store
        // NB! Should be done by a custom store method like this: todoStore.updateTasks(currentId, tasks);
        todoStore.update(store => {
            let updatedLists = [...store.lists];
            let listIndex = updatedLists.findIndex(l => l.id.toString() === currentId);
            if (listIndex !== -1) {
                updatedLists[listIndex].tasks = tasks;
            }
            return { ...store, lists: updatedLists };
        });
    }

    // Function to handle when a task is unchecked
    function cancelTaskTimer(index: number): void {
        clearTimeout(tasks[index].timerId);
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

<div class="pl-64">
    <div class="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16 border-t-2 border-gray-100">
        <div class="px-4 py-4">
            <a href="/list" class="inline-block bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M26.105,21.891c-0.229,0-0.439-0.131-0.529-0.346l0,0c-0.066-0.156-1.716-3.857-7.885-4.59 c-1.285-0.156-2.824-0.236-4.693-0.25v4.613c0,0.213-0.115,0.406-0.304,0.508c-0.188,0.098-0.413,0.084-0.588-0.033L0.254,13.815 C0.094,13.708,0,13.528,0,13.339c0-0.191,0.094-0.365,0.254-0.477l11.857-7.979c0.175-0.121,0.398-0.129,0.588-0.029 c0.19,0.102,0.303,0.295,0.303,0.502v4.293c2.578,0.336,13.674,2.33,13.674,11.674c0,0.271-0.191,0.508-0.459,0.562 C26.18,21.891,26.141,21.891,26.105,21.891z"/>
                </svg>
            </a>
        </div>
        {#if list.id}
            <div class="px-4 py-2">
                <h1 class="text-gray-800 font-bold text-2xl uppercase">{list.title}</h1>
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
                                    bind:checked={task.checked}
                                    on:change={
                                        task.checked ? () => startTaskTimer(task, index) : () => cancelTaskTimer(index)
                                    }
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
        {:else}
            <div class="px-4 py-4">
                <h1 class="text-xl">List not found!</h1>
                <p class="mt-6">¯\_(ツ)_/¯</p>
            </div>
        {/if}
    </div>
</div>