<script lang="ts">
    import { todoStore } from '../../stores/todoStore';
    $: totalTasks = $todoStore.lists.reduce((sum, list) => sum + list.tasks.length, 0);
</script>

<div class="pl-64">
    <div class="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16 border-t-2 border-gray-100">
        <div class="px-4 py-2">
            <h1 class="text-gray-800 font-bold text-xl uppercase">TO DO app</h1>
            <p>{$todoStore.lists.length} lists found with total of {totalTasks} tasks!</p>
            <ul class="mt-6">
                {#each $todoStore.lists as list}
                    <li>
                        <a href="/list/{list.id}" class="text-teal-500 hover:text-teal-700 transition duration-300 ease-in-out text-lg font-semibold">
                            {list.title}
                        </a>
                        ({list.tasks.filter(task => !task.done).length} undone)
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>