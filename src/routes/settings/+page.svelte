<script>
	import SectionTitle from '$lib/components/Parts/SectionTitle.svelte';
	import { userStore } from '$lib/store';

	const config = $userStore.config;
</script>

<div class="flex flex-col gap-6">
	<!-- <div class="contentBlock">
		<SectionTitle class="big">Settings</SectionTitle>
	</div> -->

	<div class="contentBlock bg">
		<!-- Col1 -->
		<div class="col1">
			<div class="avatar big">
				{#if $userStore.profile.picture}
					<img src={$userStore.profile.picture} alt="You" referrerpolicy="no-referrer" />
				{/if}
			</div>
		</div>

		<!-- Col2 -->
		<div class="col2 gap-3">
			<!-- Row1 -->
			<div class="usermeta">
				<input
					type="text"
					class="configBig"
					autocomplete="username"
					bind:value={$userStore.profile.name}
				/>
			</div>

			<input type="text" class="configBig" placeholder="NIP-05" />

			<!-- Row 2 -->
			<div class="note">
				<textarea placeholder="BIO" class="configBig" />
			</div>
		</div>
	</div>

	<div class="contentBlock flex-col bg">
		<SectionTitle>Client Settings</SectionTitle>
		<div class="row">
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.autoDisconnect} />
				<p>Automatically disconnect after 20 minutes.</p>
			</label>
			<!--  -->
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.showRelayStatus} />
				<p class="flex-grow">Show relay connection status.</p>
			</label>
			<!--  -->
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.fetch.usersAlways} />
				<p>Always fetch user information.</p>
			</label>
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.fetch.roomsAlways} />
				<p>Always fetch room information.</p>
			</label>
			<div>
				If not selected, it will only be fetched no information previosly fetched or older than 3
				days.
			</div>
		</div>
		<!--  -->
		<div class="row">
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.fetch.loadLimit} />
				<p class="flex-grow">
					Load first {config.onstart.loadCount} notes then show in chunks.
				</p>
				<input
					type="number"
					bind:value={config.onstart.loadCount}
					min="10"
					max="100"
					class="configValue"
				/>
			</label>
		</div>
		<!--  -->
	</div>
	<div class="contentBlock flex-col bg">
		<SectionTitle>Resource Settings</SectionTitle>
		<div class="row">
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.limits.relayLimited} />
				<p class="flex-grow">Limit connected relay instances count.</p>
				<input
					type="number"
					bind:value={config.limits.relayCount}
					min="10"
					max="100"
					class="configValue"
				/>
			</label>

			<!--  -->
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.limits.noteLimited} />
				<p class="flex-grow">Limit stored post count.</p>
				<input
					type="number"
					bind:value={config.limits.noteCount}
					min="10"
					max="100"
					class="configValue"
				/>
			</label>
			<!--  -->
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.limits.profileLimited} />
				<p class="flex-grow">Limit stored profile count.</p>
				<input
					type="number"
					bind:value={config.limits.profileCount}
					min="10"
					max="100"
					class="configValue"
				/>
			</label>
			<!--  -->
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.limits.chatMessageLimited} />
				<p class="flex-grow">Limit stored chat message count.</p>
				<input
					type="number"
					bind:value={config.limits.chatMessageCount}
					min="10"
					max="100"
					class="configValue"
				/>
			</label>
			<!--  -->
			<label class="flex gap-2">
				<input type="checkbox" bind:checked={config.limits.dmLimited} />
				<p class="flex-grow">Limit stored dm count.</p>
				<input
					type="number"
					bind:value={config.limits.dmCount}
					min="10"
					max="100"
					class="configValue"
				/>
			</label>
			<!--  -->
		</div>
	</div>
	<div class="contentBlock flex-col bg">
		<SectionTitle>Keys & Backup</SectionTitle>
		<div class="flex gap-3">
			<button class="primary">Display My Keys</button>
			<button class="primary">Download My Settings</button>
			<button class="secondary">Disconnect</button>
		</div>
	</div>
</div>
<!-- 
	- Do not connect more than n clients at the same time.
	- Show Relay server statuses.
 -->
