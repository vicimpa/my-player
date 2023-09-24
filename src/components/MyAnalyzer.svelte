<script lang="ts">
  import { frequencies } from "config";
  import { ctx as audioCtx } from "ctx";
  import { Color } from "library/Color";
  import { avgArray } from "library/avgArray";
  import { col } from "library/col";
  import { makeColorBuilder } from "library/colorBuilder";
  import { minMax } from "library/math";
  import { onFrame } from "library/onFrame";

  export let source: AudioNode;

  let can: HTMLCanvasElement | null;
  $: ctx = can?.getContext("2d") as CanvasRenderingContext2D;

  const analyze = audioCtx.createAnalyser();

  analyze.fftSize = 4096;
  analyze.maxDecibels = -25;
  analyze.minDecibels = -85;
  analyze.smoothingTimeConstant = 0.6;

  source.connect(analyze);

  const length = analyze.frequencyBinCount;
  let data = new Uint8Array(length);

  const avgFrequencies = avgArray(frequencies, 2);

  const smpl = audioCtx.sampleRate / length;

  const getColor = makeColorBuilder([
    {
      color: new Color(120, 255, 77),
      weight: 10,
    },
    {
      color: new Color(255, 191, 77),
      weight: 15,
    },
    {
      color: new Color(255, 20, 46),
      weight: 15,
    },
  ]);

  const updateData = avgFrequencies
    .map((e, i, d) => {
      const start = Math.round(e / smpl);
      const end = Math.round(d[i + 1] / smpl);

      return () => {
        let sum = 0;

        for (let j = start; j < end; j++) {
          sum += data[j];
        }

        return (sum / (end - start)) * 0.6;
      };
    })
    .filter((e) => !isNaN(e()));

  let showData = updateData.map((e) => e());

  for (let i = 0; i < avgFrequencies.length; i++) {}

  const lines = showData.map((_, i, d) => ({
    peak: 0,
    time: 0,
    get value() {
      return d[i];
    },
  }));

  const xs = showData.length - 1;
  const ys = 32;

  const colors = Array.from({ length: ys }, (_, y) =>
    getColor(1 - y / ys).toHex()
  );

  onFrame((dtime, time) => {
    analyze.getByteFrequencyData(data);

    for (let i = 0; i < length; i++) {
      data[i] = data[i];
    }

    for (let i = 0; i < showData.length; i++) {
      showData[i] = updateData[i]();
    }

    if (!can || !ctx) return;

    const width = (can.width = can.offsetWidth);
    const height = (can.height = can.offsetHeight);

    ctx.clearRect(0, 0, width, height);

    const sX = width / xs;
    const sY = height / ys;

    for (let x = 0; x < xs; x++) {
      const line = lines[x];
      const { value } = line;

      if (value > line.peak) {
        line.peak = value;
        line.time = time;
      }

      if (time - line.time > 400) {
        line.peak -= dtime * 0.3;
      }
      let hasRed = false;

      for (let y = 0; y < ys; y++) {
        const d = ((ys - 1 - y) / ys) * 255;
        const c = ((ys - 1 - y - 1) / ys) * 255;

        ctx.globalAlpha = minMax((ys - 1 - y) / ys + 0.5, 0, 1);

        if (d < value) {
          ctx.fillStyle = colors[y];
        } else if (c < line.peak && !hasRed) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = colors[minMax(y - 5, 0, colors.length - 1)];
          hasRed = true;
        } else {
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = "#444";
        }
        ctx.fillRect(x * sX + 1, y * sY + 1, sX - 2, sY - 2);
      }
    }
  });
</script>

<div class="eq">
  <canvas class="can" bind:this={can} />
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
    gap: 1px

    .can
      position: absolute
      top: 0px
      left: 0px
      right: 0px
      bottom: 0px
      width: 100%
      height: 100%
      // opacity: .6
      background-color: rgba(0,0,0,0.6)
      //
</style>
