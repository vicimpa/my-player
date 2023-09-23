<script lang="ts">
  import AudioMotionAnalyzer from "audiomotion-analyzer";

  export let source: AudioNode;
  let container: HTMLDivElement;

  $: if (container) {
    const ama = new AudioMotionAnalyzer(container, {
      source: source,
      showScaleX: false,
      volume: 0,
      mode: 6,
      colorMode: "gradient",
      channelLayout: "dual-combined",
      gradient: "classic",
      maxDecibels: 0,
      minDecibels: -85,
      linearBoost: 1.6,
      smoothing: 0.5,
      mirror: 0,
      alphaBars: true,
      ledBars: true,
      bgAlpha: 0.8,
      overlay: true,
      fillAlpha: 1,
    });
  }
</script>

<div class="eq" bind:this={container} />

<style lang="sass">
  .eq
    width: 100%
    height: 100%
    opacity: 1
    background: translate
</style>
