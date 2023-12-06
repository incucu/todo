<script lang="ts">
    export let todoStore;
    export let page;

    $: listId = $page.params.id;
</script>

<div class="px-4 py-2">
    <h2 class="text-gray-800 font-bold text-base uppercase"><a href="/list">Lists</a></h2>
    <nav class="mt-2">
        {#each $todoStore.lists as list}
            <a href="/list/{list.id}" class="block text-gray-800 font-semibold py-2 px-4 hover:bg-gray-100 rounded {list.id == listId ? 'text-teal-500' : ''}">
                {list.title}
                <!-- Let's show the number of undone tasks, if fouund -->
                {#if list.tasks.some(task => !task.done)}
                    ({list.tasks.filter(task => !task.done).length})
                {/if}
            </a>
        {/each}
    </nav>
</div>