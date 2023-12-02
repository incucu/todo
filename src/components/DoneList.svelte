<script lang="ts">
    import { page } from '$app/stores';
    import { todoStore } from '../stores/todoStore';
    import DoneTask from '../components/DoneTask.svelte';

    $: currentId = $page.params.id;
    $: tasks = $todoStore.lists.find(list => list.id.toString() === currentId)?.tasks || [];

    //setTimeout(() => console.log(tasks), 1000);

    function handleMarkUnDone(event: Event): void {
        const index = tasks.findIndex(t => t.id === event.detail.task.id);
        if(index !== -1) {
            tasks[index].done = false;
            tasks[index].checked = false;
            tasks[index].completedAt = null;
            const [task] = tasks.splice(index, 1);
            tasks.unshift(task); // Add the task to the top of the array

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
                            {task}
                            on:markundone={handleMarkUnDone}
                        />
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
{/if}