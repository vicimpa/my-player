<script lang="ts">
  import { ctx } from "ctx";
  import { onFrame } from "library/onFrame";

  export let source: AudioNode;

  const analyze = ctx.createAnalyser();

  analyze.maxDecibels = -25;
  analyze.minDecibels = -85;

  source.connect(analyze);

  let data = new Float32Array(analyze.frequencyBinCount);

  onFrame(() => {
    analyze.getFloatFrequencyData(data);
    data = data;
  });
</script>

<div class="eq">
  {#each data as v, i}
    <div class="item" id={"d" + i} style="height: {v + 100}%; opacity: 1" />
  {/each}
</div>

<style lang="sass">
  .eq
    width: 100%
    height: 100%
    opacity: 1
    background: translate
    display: flex
    flex-direction: row
    align-items: flex-end
    background: rgba(0,0,0,0.5)
    left: 0
    right: 0
    position: absolute

    .item
      flex-grow: 1
      background: linear-gradient(red, purple)
      opacity: 0.4
      //
</style>
