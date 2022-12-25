<script>
	import { userStore } from '$lib/store';
</script>

<div class="contentBlock bg">
	<!-- Col1 -->
	<div class="col1">
		<div class="avatar">
			{#if $userStore.profile.picture}
				<img src={$userStore.profile.picture} alt="You" referrerpolicy="no-referrer" />
			{/if}
		</div>
	</div>

	<!-- Col2 -->
	<div class="col2">
		<!-- Row1 -->
		<div class="usermeta">
			<div class="username">
				{$userStore.profile.name ? $userStore.profile.name : 'Unkown user'}
			</div>
			<div class="pk">{$userStore.profile.pubkey}</div>
		</div>

		<!-- Row 2 -->
		<div class="note">
			<textarea placeholder="Write freely." />
		</div>
	</div>
</div>
