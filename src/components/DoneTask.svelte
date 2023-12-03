<script lang="ts">
    import type { Task } from '../types/types';
    import { createEventDispatcher } from 'svelte';
    import { showDates } from '../stores/stateStore';
    import { todoStore } from '../stores/todoStore';

    const dispatch = createEventDispatcher();

    export let task: Task;

    function markUnDone(): void {
        dispatch('markundone', { task });
    }
</script>

<li class="py-4 flex justify-between items-center group">
    <div class="text-container">
        <span class="block text-gray-900 font-medium">{task.text}</span>
        {#if $showDates}
            <span class="text-gray-400 text-xs">Added: {todoStore.formatTaskDate(task.createdAt)}  |  Completed: {todoStore.formatTaskDate(task.completedAt)}</span>
        {/if}
    </div>
    <button
        class="text-xs text-white bg-teal-500 hover:bg-teal-700 px-2 py-1 rounded"
        on:click={() => markUnDone()}>
        Not&nbsp;Done
    </button>
</li>