<script lang="ts">
  import { time } from "library/time";
  import type { IMusic } from "playlist";
  import parse from "id3-parser";
  import type { IID3Tag } from "id3-parser/lib/interface";

  export let currentTime = 0;
  export let duration = 0;

  export let selected: IMusic | null = null;

  let idtag: IID3Tag | false = false;

  export let cover: string | null = null;

  $: {
    if (selected) {
      fetch(selected.url)
        .then((res) => res.arrayBuffer())
        .then((buffer) => (idtag = parse(new Uint8Array(buffer))));
    } else {
      idtag = false;
    }
  }

  $: {
    if (idtag && idtag.image) {
      const array = new Uint8Array(idtag.image.data);
      const blob = new Blob([array]);
      cover = URL.createObjectURL(blob);
    } else {
      cover = null;
    }
  }
</script>

<div class="head">
  <div class="info" style="background-image: url({cover});">
    <div class="slot">
      <slot />
    </div>

    <div class="name">
      {#if idtag}
        <p>{idtag.artist} - {idtag.title} [{idtag.genre}] ({idtag.year})</p>
      {:else}
        <p>{selected ? selected.name : "Unselected"}</p>
      {/if}
    </div>

    <p class="time">{time(currentTime)} / {time(duration)}</p>
  </div>
</div>

<style lang="sass">
  .head
    gap: 10px
    display: flex
    user-select: none
    
    &:hover
      .name
        opacity: 1!important
        color: #fff

    .info
      height: 100px
      background-position: center
      background-size: cover
      transition: background .3s
      box-shadow: 0 0 10px #000

    .info
      flex-grow: 1
      background-color: rgba(0,0,0,0.2)
      display: flex
      flex-direction: column
      padding: 5px
      justify-content: space-between
      position: relative

      .slot
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0

      p
        z-index: 1

      .name
        overflow: hidden
        opacity: .6
        padding-left: 5px
        font-size: 12px
        transition: 0.3s
        z-index: 1
        font-weight: 600
        text-shadow: 0 0 4px #000
          
      .time
        text-align: right
        font-size: 10px
        font-weight: 600
        transform: translateY(20px)
</style>
