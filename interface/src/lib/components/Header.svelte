<script lang="ts">
    import {
        walletAddress,
        getSigner,
        connectWallet,
    } from "$lib/stores/wallet";
    import { onMount } from "svelte";

    onMount(async () => {
        await getSigner();
    });
</script>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">NFT Marketplace</a>
        {#if $walletAddress}
            <h2>{$walletAddress}</h2>
        {:else}
            <button
                class="btn btn-outline-success"
                type="submit"
                on:click={connectWallet}>Connect Metamask</button
            >
        {/if}
    </div>
</nav>
