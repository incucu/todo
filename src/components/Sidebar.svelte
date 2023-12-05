<script lang="ts">
    import { page } from '$app/stores';
    import { todoStore } from '../stores/todoStore';
    import SidebarSettings from './SidebarSettings.svelte';
    import SidebarAddList from './SidebarAddList.svelte';
    import SidebarList from './SidebarList.svelte';
</script>

<div class="fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white shadow-lg">
    {#if $page.params.id}
        <SidebarSettings />
    {/if}
    <SidebarAddList {todoStore} {page}/>
    <SidebarList {todoStore} {page} />
</div>