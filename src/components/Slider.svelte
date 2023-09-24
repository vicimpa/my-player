<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from "svelte";

  export let value: number = 0;
  export let defaultValue = 1;
  export let id = Math.random() + "";
  export let minValue = 0;
  export let maxValue = 1;
  export let disabled = false;

  $: size = maxValue - minValue;

  let slider: HTMLDivElement;
  const dispatch = createEventDispatcher<{
    changeVolume: number;
  }>();

  let val = 0;

  val = getValue(id);

  function getValue(id: string) {
    const val = localStorage.getItem(id) ?? defaultValue + "";
    return isNaN(+val) ? defaultValue : +val;
  }

  function setValue(id: string, value: number) {
    localStorage.setItem(id, `${value}`);
  }

  let up = false;

  function side(e: MouseEvent) {
    if (disabled) return;
    if (!slider) return;
    if (e.type === "mouseup") {
      up = false;
      return;
    } else if (e.type === "mousedown") {
      if (e.button === 0) up = true;
      if (e.button === 2) {
        val = defaultValue;
        return;
      }
    }
    if (!up) return;

    const { y, height } = slider.getBoundingClientRect();
    let nowY = e.clientY;

    if (nowY < y) nowY = y;
    if (nowY > y + height) nowY = y + height;
    nowY -= y;
    val = (1 - nowY / height) * size + minValue;
  }

  onMount(() => {
    addEventListener("mousemove", side);
    addEventListener("mouseup", side);
  });

  onDestroy(() => {
    removeEventListener("mousemove", side);
    removeEventListener("mouseup", side);
  });

  $: {
    value = disabled ? defaultValue : val;
    if (val !== defaultValue) setValue(id, val);
  }

  $: {
    dispatch("changeVolume", value);
  }
</script>

<div class="container" data-disabled={disabled}>
  <div class="slider" bind:this={slider} on:mousedown={side} on:mouseup={side}>
    <div class="point" style="bottom: {((val - minValue) / size) * 100}%" />
  </div>
  <slot />
</div>

<style lang="sass">
  .container
    width: 40px
    display: flex
    flex-direction: column
    align-items: center
    font-size: 10px
    user-select: none
    height: 100%
    gap: 5px

    &[data-disabled=true]
      opacity: 0.3

      .slider
        cursor: not-allowed

    .slider
      width: 5px
      background-color: #999
      flex-grow: 1
      cursor: pointer
      display: flex

      position: relative
      
      .point
        width: 12px
        height: 2px
        border-radius: 100%
        background-color: #ddd
        position: absolute
        left: -3px
</style>
