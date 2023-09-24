<script lang="ts">
  import { appendMusic, type IMusic } from "playlist";
  import { createEventDispatcher } from "svelte";

  let append: HTMLDivElement;
  let isAppend = false;

  const dispatch = createEventDispatcher<{ select: IMusic }>();

  const fileOpen = document.createElement("input");

  fileOpen.type = "file";
  fileOpen.multiple = true;
  fileOpen.onchange = () => {
    loadFiles(fileOpen.files);
  };

  function loadFiles(files: FileList) {
    for (const file of files) {
      if (file.type.indexOf("audio") === 0) {
        file.arrayBuffer().then((buffer) => {
          const blob = new Blob([buffer]);
          const url = URL.createObjectURL(blob);
          appendMusic(file.name, url);
        });
      }
    }
    isAppend = false;
  }

  export let playing = false;
  export let selected: IMusic | null = null;
  export let playlist: IMusic[] = [];

  function onDragStart() {
    isAppend = true;
  }

  function onDragEnd() {
    isAppend = false;
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    loadFiles(e.dataTransfer.files);
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
  }
</script>

<div class="playlist" on:dragenter={onDragStart}>
  {#each playlist as track}
    <div
      data-select={track === selected}
      data-playing={playing}
      class="track"
      on:mousedown={() => dispatch("select", track)}
    >
      <p><b>🎵</b>{track.name}</p>
    </div>
  {/each}

  <div class="append" data-isappend={isAppend} bind:this={append}>
    <p>
      Append file
      <button on:click={() => fileOpen.click()}> Open </button>
    </p>
  </div>
</div>

<div
  class="drop"
  data-isappend={isAppend}
  on:drop={onDrop}
  on:dragover={onDragOver}
  on:dragleave={onDragEnd}
  on:mouseleave={onDragEnd}
/>

<style lang="sass">
  button
    cursor: pointer

  .drop
    position: absolute
    left: 0
    right: 0
    top: -100%
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    background-color: rgba(255,255,255,0.6)
    z-index: 1
    transition: top 0.3s
    background-image: url('/images/drop.png')
    background-position: center
    background-size: 100px
    background-repeat: no-repeat

    &[data-isappend=true]
      top: 0%

  .playlist
    padding: 10px
    display: flex
    flex-direction: column
    gap: 5px
    height: 300px
    overflow-y: scroll
    background-color: rgba(0,0,0,0.6)
    backdrop-filter: blur(10px)
    position: relative
    transition: background .3s

    

    .append
      padding: 50px
      display: flex
      justify-content: center

    &::-webkit-scrollbar
      width: 5px
      height: 8px
      background-color: #aaa
    
    &::-webkit-scrollbar-thumb
      background-color: #000

    
    .track
      padding: 3px
      cursor: pointer
      display: flex
      gap: 5px

      p
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        flex-grow: 1
        b
          margin-right: 10px

      &:hover
        background-color: rgba(0,0,0,0.1)

      &[data-select=true]
        background-color: #111

        &[data-playing=true]
          background-color: #444
</style>
