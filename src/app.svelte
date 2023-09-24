<script lang="ts">
  import { rem } from "library/math";
  import { onCalc } from "library/onCalc";
  import { playlist, type IMusic } from "playlist";
  import Info from "components/Info.svelte";
  import Buttons from "components/Buttons.svelte";
  import Playlist from "components/Playlist.svelte";
  import Settings from "components/Settings.svelte";
  import { ctx } from "ctx";
  import MyAnalyzer from "components/MyAnalyzer.svelte";

  const audio = new Audio();
  const gain = ctx.createGain();
  const source = ctx.createMediaElementSource(audio);
  const forAnalyze = ctx.createGain();

  let cover: string | null;

  console.log(audio);

  audio.volume = 1;
  audio.muted = false;
  audio.preload = "metadata";
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
      audio.play();
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
  <a
    href="https://github.com/vicimpa/my-player"
    target="_blank"
    title="GitHub Repository"
  >
    <i class="icons-github" />
  </a>
  <div class="controll">
    <Info bind:cover {selected} currentTime={$currentTime} duration={$duration}>
      <MyAnalyzer source={forAnalyze} />
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
  <Settings input={source} output={gain} analyze={forAnalyze} />
  <Playlist
    playlist={$playlist}
    {selected}
    playing={$playing}
    on:select={(e) => select(e.detail)}
  />
</div>
<br />

<style lang="sass">
  .player
    width: 350px
    height: calc(100vh - 40px)
    background-color: #444
    display: flex
    flex-direction: column
    position: relative
    background-position: center
    background-size: cover
    box-shadow: 0 0 10px #000
    transition: background .3s .2s
    overflow: hidden
    border: 2px solid #000
    border-radius: 10px

  .controll
    padding: 10px
    display: flex
    flex-direction: column
    gap: 5px
    position: relative
    backdrop-filter: blur(5px)
    background-color: rgba(0,0,0,0.7)
    transition: background .3s
    z-index: 1

  .controll 
    gap: 10px

  a
    position: absolute
    color: #666
    text-decoration: none
    z-index: 2
    text-shadow: 0 0 10px #000
    box-shadow: 0 0 10px #000
    top: 0px
    right: 0px
    font-size: 24px
    padding: 5px 15px  
    background-color: #000
    transition: 0.3s
    border-radius: 0 0 0 10px

    &:hover
      color: #fff
</style>
