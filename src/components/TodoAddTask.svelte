<script lang="ts">
    import { page } from '$app/stores';
    import { tick } from 'svelte';
    import { todoStore } from '../stores/todoStore';

    $: listId = $page.params.id;

    let addTaskInput: HTMLInputElement;
    // Let's focus the task adding input
    $: if (listId) {
        tick().then(() => {
            // even with tick() there will be racing conditions, so have to use a delay to make sure the input gets focused
            setTimeout(() => addTaskInput.focus(), 500);
        });
    }

    function handleAddTask() {
        const taskText = addTaskInput.value.trim();
        if (taskText) {
            todoStore.addTask(listId, taskText);
            addTaskInput.value = '';
        }
    }

    // Let's add the task when user presses the enter key
    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleAddTask();
        }
    }

</script>

<div class="w-full max-w-xl mx-auto px-4 py-2">
    <div class="flex items-center border-b-2 border-teal-500 py-2">
        <input
            bind:this={addTaskInput}
            class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text" placeholder="Add a task" 
            on:keypress={handleKeyPress}
        />
        <button
            class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button"
            on:click={handleAddTask}>
            Add
        </button>
    </div>
</div>