<script lang="ts">
	import { onMount } from "svelte";

	export let value: string;
	export let option: string;
	export let closeModal: () => void;
	export let submission: (value: string, option: string) => void;

	function onSubmit(e: Event) {
		e.preventDefault();
		submission(value, option);
	}

	onMount(() => {
		const tagInput = document.getElementById("tagInput") as HTMLInputElement;

		//Use setTimeout to focus on input after the DOM has been loaded.
		setTimeout(() => {
			tagInput.focus();
		}, 0);
	});
</script>

<span>
	If you add multiple tags, separate them with commas. Do not add '#'.
</span>
<form on:submit={onSubmit} class="modal-form">
	<select>
		<option selected={option === "inline"}>Inline</option>
		<option selected={option === "yaml"}>YAML</option>
	</select>
	<input id="tagInput" type="text" bind:value />
	<div class="modal-button-container">
		<button type="submit" class="mod-cta">Submit</button>
		<button on:click={closeModal}>Cancel</button>
	</div>
</form>
