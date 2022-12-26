<script>
	import SectionTitle from './SectionTitle.svelte';
	import { siteStore } from '$lib/store';
	import { relays } from '$lib/libraries/constants';
	// import CardUser from './CardUser.svelte';
	// import Icon from './Icon.svelte';

	let connected = true;
	let sending = true;
	let receiving = true;
	let mini = true;

	setInterval(() => {
		sending = !sending;
	}, 733);

	setInterval(() => {
		receiving = !receiving;
	}, 233);
</script>

<SectionTitle>Connected Relays</SectionTitle>
<div class="list" class:wrap={mini}>
	{#each $siteStore.connectedRelays as relay}
		<div class="card server" title={relay}>
			<div class="icon servericon {connected ? 'connected' : 'disconnected'}">
				<svg viewBox="0 0 420 430" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g id="server">
						<path
							id="server_2"
							d="M303.737 341.316H409V383.421H303.737V341.316ZM114.263 341.316V383.421H9V341.316H114.263ZM9 15H409V109.737H9V15ZM387.947 36.0526H366.895V88.6842H387.947V36.0526ZM345.842 36.0526H324.789V88.6842H345.842V36.0526ZM303.737 36.0526H282.684V88.6842H303.737V36.0526ZM30.0526 67.6316V88.6842H51.1053V67.6316H30.0526ZM9 130.789H409V225.526H9V130.789ZM30.0526 183.421V204.474H51.1053V183.421H30.0526Z"
							fill="black"
						/>
						<path
							id="ul"
							d="M360.655 154.627C362.573 151.26 367.427 151.26 369.345 154.627L397.017 203.208C399.748 208.001 393.845 213.035 389.543 209.583L368.13 192.397C366.301 190.93 363.699 190.93 361.87 192.397L340.457 209.583C336.155 213.035 330.252 208.001 332.983 203.208L360.655 154.627Z"
							fill={sending ? 'green' : 'white'}
						/>
						<path
							id="dl"
							d="M303.331 202.493C301.407 205.828 296.593 205.828 294.669 202.493L267.082 154.676C264.327 149.9 270.197 144.834 274.518 148.258L295.895 165.197C297.714 166.638 300.286 166.638 302.105 165.197L323.482 148.258C327.803 144.834 333.673 149.9 330.918 154.676L303.331 202.493Z"
							fill={receiving ? 'green' : 'white'}
						/>
						{#if connected}
							<path
								id="connected"
								d="M230.052 320.263L230.053 246.579H187.947V320.263H145.842C134.215 320.263 124.789 329.688 124.789 341.316V383.421C124.789 395.048 134.215 404.474 145.842 404.474H272.158C283.784 404.474 293.211 395.048 293.211 383.421V341.316C293.211 329.688 283.785 320.263 272.158 320.263H230.052Z"
								fill="black"
							/>
						{:else}
							<g id="disconnected">
								<rect
									id="Rectangle 1"
									x="249.723"
									y="288"
									width="42"
									height="158"
									transform="rotate(45 249.723 288)"
									fill="black"
								/>
								<rect
									id="Rectangle 1_2"
									x="138"
									y="317.698"
									width="42"
									height="158"
									transform="rotate(-45 138 317.698)"
									fill="black"
								/>
								<path
									id="Vector"
									d="M187.947 246.579V270.263L209 291.316L230.053 270.263V246.579H187.947Z"
									fill="black"
								/>
							</g>
						{/if}
						<g id="leds">
							<rect
								id="led"
								x="30"
								y="67"
								width="22"
								height="22"
								fill={connected ? '#33FF00' : 'red'}
							/>
							<rect
								id="led_2"
								x="30"
								y="183"
								width="22"
								height="22"
								fill={connected ? '#33FF00' : 'red'}
							/>
						</g>
					</g>
				</svg>
			</div>
			<!-- {#if !mini}
				<div>
					{relay.replace('wss://', '')}
				</div>
			{/if} -->
		</div>
	{/each}
</div>
