<script lang="ts">
  import { ctx } from "ctx";
  import Slider from "./Slider.svelte";
  import { onDestroy } from "svelte";
  import { frequencies } from "config";

  export let input: AudioNode;
  export let output: AudioNode;
  export let analyze: AudioNode | undefined = undefined;

  let volume = 0;
  let enabled = !!localStorage.getItem("settings");

  $: {
    localStorage.setItem("settings", enabled ? "1" : "");
  }

  function createFilter(frequency: number) {
    var filter = ctx.createBiquadFilter();

    filter.type = "peaking";
    filter.frequency.value = frequency;
    filter.Q.value = 1;
    filter.gain.value = 0.5;

    return filter;
  }

  const filters = frequencies
    .slice(1, frequencies.length - 1)
    .map(createFilter);

  input.connect(filters[0]);

  function value(n: number) {
    if (n >= 1000) return ((n / 1000) | 0) + "k";
    return n;
  }

  filters.reduce((prev, curr) => {
    prev.connect(curr);
    return curr;
  });

  const gain = ctx.createGain();
  filters.at(-1).connect(gain);
  gain.connect(output);

  onDestroy(() => {
    gain.disconnect();
    input.disconnect(filters[0]);
    filters.at(-1).disconnect(gain);
  });

  $: {
    if (analyze) {
      filters.at(-1).connect(analyze);
    }
  }

  $: {
    gain.gain.value = volume;
  }
</script>

<div class="settings">
  {#each filters as f, i}
    <Slider
      id={`eq${i}`}
      defaultValue={0}
      minValue={-16}
      disabled={!enabled}
      maxValue={16}
      bind:value={f.gain.value}
    >
      {value(f.frequency.value)}
    </Slider>
  {/each}

  <div />

  <div class="last">
    <button on:click={() => (enabled = !enabled)}
      >{enabled ? "Off" : "On"}</button
    >
    <Slider id="volume" bind:value={volume} defaultValue={0.3}>
      <i class="icons-volume-high" />
    </Slider>
  </div>
  <!--  -->
</div>

<style lang="sass">
  button
    font-size: 10px
    padding: 0px
    margin: 0
    cursor: pointer

  .settings
    width: 100%
    height: 120px
    top: 100%
    left: 0
    background-color: rgba(0,0,0,0.9)
    backdrop-filter: blur(5px)
    padding: 10px
    display: flex
    gap: 10px
    justify-content: space-between
    box-shadow: 0 4px 5px #000
    padding: 15px

    .last
      display: flex
      flex-direction: column
      justify-content: space-between
      gap: 5px
</style>
