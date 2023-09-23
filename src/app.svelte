<script lang="ts">
  import { rem } from "library/math";
  import { onCalc } from "library/onCalc";
  import { playlist, type IMusic } from "playlist";
  import Info from "components/Info.svelte";
  import Buttons from "components/Buttons.svelte";
  import Playlist from "components/Playlist.svelte";
  import Analyzer from "components/Analyzer.svelte";
  import Settings from "components/Settings.svelte";
  import { ctx } from "ctx";

  const audio = new Audio();
  const gain = ctx.createGain();
  const source = ctx.createMediaElementSource(audio);

  let cover: string | null;

  gain.connect(ctx.destination);
  audio.onended = () => nextTrack();
  audio.autoplay = true;

  let previewSelected: IMusic | null = null;
  let selected: IMusic | null = null;

  function select(music = selected) {
    if (!music) {
      music = playlist[0];
    }

    previewSelected = selected;
    selected = music;

    if (!audio.paused) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    ctx.resume();
  }

  function playPause() {
    select();
  }

  function stop() {
    audio.pause();
    audio.currentTime = 0;
  }

  function nextTrack() {
    let index = $playlist.indexOf(selected);
    if (index === -1) return select();
    select($playlist[rem(index + 1, $playlist.length)]);
  }

  function previewTrack() {
    let index = $playlist.indexOf(selected);
    if (index === -1) return select();
    select($playlist[rem(index - 1, $playlist.length)]);
  }

  function slideTo(n: number) {
    if ($playing && !isNaN($duration)) {
      audio.currentTime = n * $duration;
    }
  }

  $: {
    if (selected && previewSelected !== selected) {
      audio.src = selected.url;
    }
  }

  let playing = onCalc(() => !audio.paused);
  let currentTime = onCalc(() => audio.currentTime);
  let duration = onCalc(() => audio.duration);
</script>

<div class="player" style="background-image: url({cover});">
  <div class="controll">
    <Info bind:cover {selected} currentTime={$currentTime} duration={$duration}>
      <Analyzer source={gain} />
    </Info>
    <Buttons
      playing={$playing}
      currentTime={$currentTime}
      duration={$duration}
      on:playPause={playPause}
      on:stop={stop}
      on:nextTrack={nextTrack}
      on:previewTrack={previewTrack}
      on:slideTo={(e) => slideTo(e.detail)}
    />
  </div>
  <Settings input={source} output={gain} />
  <Playlist
    playlist={$playlist}
    {selected}
    playing={$playing}
    on:select={(e) => select(e.detail)}
  />
</div>
<br />
<a href="https://github.com/vicimpa/my-player">GitHub Repository</a>

<style lang="sass">
  .player
    width: 350px
    background-color: #444
    display: flex
    flex-direction: column
    position: relative
    background-position: center
    background-size: cover
    box-shadow: 0 0 10px #000
    transition: background .3s

  .controll
    padding: 10px
    display: flex
    flex-direction: column
    gap: 5px
    position: relative
    backdrop-filter: blur(5px)
    background-color: rgba(0,0,0,0.7)
    transition: background .3s

  .controll 
    gap: 10px

  a
    color: #fff
</style>
