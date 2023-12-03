<script lang="ts">
    import type { Task } from '../types/types';
    import { todoStore } from '../stores/todoStore';
    import { createEventDispatcher } from 'svelte';
    import { showDates } from '../stores/stateStore';
    const dispatch = createEventDispatcher();

    export let task: Task;
    export let index: number;
    export let draggingItemId: number | null = null;

    function onDragStart(event: DragEvent) {
        dispatch('dragstart', { event, task, index });
    }

    function onDragOver(event: DragEvent) {
        event.preventDefault(); // to allow dropping
        dispatch('dragover', { event, index });
    }

    function onDragEnd() {
        dispatch('dragend');
    }

    // task is checked
    function startTaskTimer(): void {
        task.timerId = window.setTimeout(() => {
            dispatch('completetask', { index });
        }, 500);
    }

    // task is unchecked
    function cancelTaskTimer(): void {
       clearTimeout(task.timerId);
    }
</script>

<style>
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
        animation: moveProgressBar .5s linear forwards;
    }

    .dragging {
        opacity: 0.5;
    }

    @keyframes moveProgressBar {
        from { width: 0; }
        to { width: 100%; }
    }
</style>

<li
    class="py-4 flex flex-col justify-between items-start group to-do-list-item {draggingItemId === task.id ? 'dragging' : ''}"
    draggable="true"
    on:dragstart={onDragStart}
    on:dragover={onDragOver}
    on:dragend={onDragEnd}
>
    <div class="checkbox-container w-full">
        <input 
            id={task.id} 
            type="checkbox" 
            class="checkbox h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
            bind:checked={task.checked}
            on:change={
                task.checked ? () => startTaskTimer() : () => cancelTaskTimer()
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
            <span class="text-gray-400 text-xs">Added: {todoStore.formatTaskDate(task.createdAt)}</span>
        </div>
    {/if}
</li>