<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  export let playing = false;
  export let currentTime = 0;
  export let duration = 0;

  let slider: HTMLDivElement | null = null;

  const dispatch = createEventDispatcher<{
    playPause: void;
    stop: void;
    previewTrack: void;
    nextTrack: void;
    slideTo: number;
  }>();

  let down = false;

  function slide(e: MouseEvent) {
    if (!slider) return;
    if (e.type === "mouseup") {
      down = false;
      return;
    }
    if (e.type === "mousedown") {
      down = true;
    }
    if (!down) return;
    const { x, width } = slider.getBoundingClientRect();
    let nowX = e.clientX;
    if (nowX < x) nowX = x;
    if (nowX > x + width) nowX = x + width;
    nowX -= x;
    dispatch("slideTo", nowX / width);
  }

  onMount(() => {
    addEventListener("mousemove", slide);
    addEventListener("mouseup", slide);
  });

  onDestroy(() => {
    removeEventListener("mousemove", slide);
    removeEventListener("mouseup", slide);
  });
</script>

<div class="buttons">
  <button on:click={() => dispatch("playPause")}>{!playing ? "▶" : "⏸"}</button>
  <button on:click={() => dispatch("stop")}>⏹</button>
  <button on:click={() => dispatch("previewTrack")}>⏮</button>
  <button on:click={() => dispatch("nextTrack")}>⏭</button>
  <div class="slider" bind:this={slider} on:mousedown={slide}>
    <div class="persent" style="left: {(currentTime / duration) * 100}%" />
  </div>
</div>

<style lang="sass">
  button
    margin: 0
    padding: 0
    cursor: pointer
    background: none
    border: none
    background-color: #999
    width: 22px
    height: 22px
    font-size: 10px
    color: #fff
    border-radius: 3px
    
  .buttons
    display: flex

    
  .buttons
    gap: 4px
    align-items: center
    user-select: none

    .slider
      flex-grow: 1
      height: 8px
      background-color: #999
      position: relative
      cursor: pointer
      border-radius: 5px

      .persent
        position: absolute
        height: 18px
        width: 2px
        background-color: #ddd
        box-shadow: 0 0 10px #000
        top: -5px
</style>
