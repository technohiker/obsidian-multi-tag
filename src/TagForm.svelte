<script lang="ts">
	export let value: string;
	export let option: string;
	export let closeModal: () => void;
	export let submission: (value: string, option: string) => void;

	function onSubmit(e: Event) {
		e.preventDefault();
		submission(value, option);
	}
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
