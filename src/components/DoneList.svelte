<script lang="ts">
    import { page } from '$app/stores';
    import { todoStore } from '../stores/todoStore';
    import { showDates } from '../stores/stateStore';

    $: currentId = $page.params.id;
    $: tasks = $todoStore.lists.find(list => list.id.toString() === currentId)?.tasks || [];

    //setTimeout(() => console.log(tasks), 1000);

    function markAsUnDone(taskId: number): void {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if(taskIndex !== -1) {
            tasks[taskIndex].done = false;
            tasks[taskIndex].checked = false;
            tasks[taskIndex].completedAt = null;
            const [task] = tasks.splice(taskIndex, 1);
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
                        <li class="py-4 flex justify-between items-center group">
                            <div class="text-container">
                                <span class="block text-gray-900 font-medium">{task.text}</span>
                                {#if $showDates}
                                    <span class="text-gray-400 text-xs">Added: {task.createdAt}  |  Completed: {task.completedAt}</span>
                                {/if}
                            </div>
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