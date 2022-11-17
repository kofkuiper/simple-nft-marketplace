<h1>Welcome to SvelteKit</h1>

<div class="row">
    {#each [1, 2, 3, 4, 5, 6, 7] as e}
        <div class="card mb-3 ms-3" style="width: 18rem;">
            <img src="..." class="card-img-top" alt="..." />
            <div class="card-body">
                <p class="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                </p>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-primary">Buy</button>
            </div>
        </div>
    {/each}
</div>
