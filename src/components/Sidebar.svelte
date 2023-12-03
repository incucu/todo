<script lang="ts">
    import { page } from '$app/stores';
    import { showDates } from '../stores/stateStore';
    import { todoStore } from '../stores/todoStore';
</script>

<div class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white shadow-lg">
    {#if $page.params.id}
        <div class="px-4 py-2">
            <label class="relative inline-flex items-center cursor-pointer mt-4">
                <input 
                    type="checkbox"
                    bind:checked={$showDates}
                    class="sr-only peer"
                    >
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                <span class="ml-3 text-sm font-medium text-gray-900">Toggle dates</span>
            </label>
        </div>
    {/if}
    <div class="px-4 py-4">
        <div class="flex items-center">
            <input
                class="appearance-none bg-transparent border-b-2 border-teal-500 w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                id="new-list-name" type="text" placeholder="Add a list">
            <button
                class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="button" onclick="addNewList()">
                Add
            </button>
        </div>
    </div>
    <div class="px-4 py-2">
        <h2 class="text-gray-800 font-bold text-base uppercase"><a href="/list">Lists</a></h2>
        <nav class="mt-2">
            {#each $todoStore.lists as list}
                <a href="/list/{list.id}" class="block text-gray-800 font-semibold py-2 px-4 hover:bg-gray-100 rounded">{list.title}</a>
            {/each}
        </nav>
    </div>
</div>