<script lang="ts">
  import { ctx } from "ctx";
  import Slider from "./Slider.svelte";
  import { onDestroy } from "svelte";
  import { frequencies } from "config";

  export let input: AudioNode;
  export let output: AudioNode;
  export let analyze: AudioNode | undefined = undefined;

  let volume = 0;
  let show = !!localStorage.getItem("showsettings");
  let enabled = !!localStorage.getItem("settings");

  $: {
    localStorage.setItem("settings", enabled ? "1" : "");
  }
  $: {
    localStorage.setItem("showsettings", show ? "1" : "");
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

<div class="settings" data-show={show}>
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

<div class="showSettings">
  <button on:click={() => (show = !show)}>
    <i class="icons-equalizer" />
  </button>
</div>

<style lang="sass">
  button
    font-size: 10px
    padding: 0px
    margin: 0
    cursor: pointer

  .showSettings
    position: relative
    justify-content: flex-end
    z-index: 1
    background: transparent

    button
      position: absolute
      right: 5px
      top: -10px
      width: 60px
      height: 30px
      background-color: rgba(0,0,0,1)
      box-shadow: 0 0 10px #000
      backdrop-filter: blur(5px)
      border-radius: 0 0 0 10px
      border: none
      color: #fff

  .settings
    background-color: rgba(0,0,0,1)
    backdrop-filter: blur(5px)
    display: flex
    width: 100%
    height: 120px
    flex-shrink: 0
    padding: 10px
    gap: 10px
    justify-content: space-between
    box-shadow: 0 4px 5px #000
    padding: 15px
    margin-top: -120px
    position: relative
    transition: 0.3s

    &[data-show=true]
      margin-top: 0px


    .last
      display: flex
      flex-direction: column
      justify-content: space-between
      gap: 5px
</style>
