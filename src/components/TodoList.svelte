<script lang="ts">
    import { tick } from 'svelte';
    import { page } from '$app/stores';

    import type { Task } from '../types/types';
    import { todoStore } from '../stores/todoStore';
    import TodoTask from '../components/TodoTask.svelte';

    let addTaskInput: HTMLInputElement;
    $: if ($page.url.pathname) {
        tick().then(() => {
            // even with tick() there will be racing conditions, so have to use a delay to make sure the input gets focused
            setTimeout(() => addTaskInput.focus(), 500);
        });
    }

    $: listId = $page.params.id;
    $: list = $todoStore.lists.find(list => list.id.toString() === listId) || {};
    $: tasks = list.tasks || [];

    let draggingItem: Task | null = null;
    let draggingItemId: number | null = null;
    let draggingItemIndex: number | null = null;
    let hoveredItemIndex : number | null = null;

    // Let's swap the positions in the tasks array when a user drags a task to a new position in the list
    $: if (
        draggingItemIndex != null &&
        hoveredItemIndex != null &&
        draggingItemIndex != hoveredItemIndex
    ) {
        todoStore.updateTaskOrder(listId, draggingItemIndex, hoveredItemIndex);

        // As the tasks are sorted in TodoStore then I need to fetch the changes manually to update the list on the page.
        // Less code would have been needed if I just sort the tasks here, but then I'm bringing some of the list handling
        // code out from the dedicated class and I don't want that to happen.
        list = $todoStore.lists.find(list => list.id.toString() === listId) || {};
        tasks = list.tasks || [];

        draggingItemIndex = hoveredItemIndex; // Update the current dragging index
    }

    // Complete the task and move it to the done list
    function handleCompleteTask(event: Event): void {
        const index = event.detail.index;
        todoStore.completeTask(listId, tasks[index].id, new Date().toLocaleString());
    }

    function handleDragStart(event: Event): void {
        const task = event.detail.task;
        const index = event.detail.index;
        draggingItem = task;
        draggingItemIndex = index;
        draggingItemId = task.id;
    }

    function handleDragOver(event: Event): void {
        hoveredItemIndex = event.detail.index;
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
</style>

<div class="pl-64">
    <div class="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16 border-t-2 border-gray-100">
        <div class="px-4 py-4">
            <a href="/list" class="inline-block bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 32 32">
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
                        <TodoTask 
                            {task} 
                            {index} 
                            {draggingItemId}
                            on:dragstart={handleDragStart}
                            on:dragover={handleDragOver}
                            on:dragend={handleDragEnd}
                            on:completetask={handleCompleteTask}
                        />
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