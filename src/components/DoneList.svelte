<script lang="ts">
    import { page } from '$app/stores';
    import { todoStore } from '../stores/todoStore';
    import DoneTask from '../components/DoneTask.svelte';

    $: listId = $page.params.id;
    $: tasks = $todoStore.lists.find(list => list.id.toString() === listId)?.tasks || [];

    function handleMarkUnDone(event: Event): void {
        const index = tasks.findIndex(t => t.id === event.detail.task.id);
        todoStore.unDoneTask(listId, tasks[index].id);
    }
</script>

{#if tasks.some(task => task.done)}
    <div class="pl-64">
        <div class="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16 border-t-2 border-gray-100">
            <div class="px-4 py-2">
                <h1 class="text-gray-800 font-bold text-2xl uppercase">Done List</h1>
            </div>
            <ul class="divide-y divide-gray-200 px-4">
                {#each tasks as task (task.id)}
                    {#if task.done}
                        <DoneTask 
                            {task} {todoStore}
                            on:markundone={handleMarkUnDone}
                        />
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
{/if}