<script lang="ts">
    import { tick } from 'svelte';

    export let todoStore; 
    export let page;

    $: listId = $page.params.id;

    let addListInput: HTMLInputElement;
    // Let's focus the list adding iinput if no list is currently open
    $: if (!listId) {
        tick().then(() => {
            // even with tick() there will be racing conditions, so have to use a delay to make sure the input gets focused
            setTimeout(() => addListInput.focus(), 500);
        });
    }

    function handleAddList() {
        const listTitle = addListInput.value.trim();
        if (listTitle) {
            todoStore.addList(listTitle);
            addListInput.value = '';
        }
    }

    // Let's add the task when user presses the enter key
    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleAddList();
        }
    }
</script>

<div class="px-4 py-4">
    <div class="flex items-center">
        <input
            bind:this={addListInput}
            class="appearance-none bg-transparent border-b-2 border-teal-500 w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            id="new-list-name" type="text" placeholder="Add a list"
            on:keypress={handleKeyPress}
        >
        <button
            class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="button" on:click={handleAddList}>
            Add
        </button>
    </div>
</div>