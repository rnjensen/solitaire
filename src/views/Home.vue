<template>
  <div class="home">
    <h1>Solitaire in Vue</h1>
    <div class="options">
      <button><router-link to="/play">New Game</router-link></button>
      <button><router-link to="/scores">View High Scores</router-link></button>
    </div>

    <h3 class="options">Please note that this is a work in progress. The game mechanics work, but I have yet to add scoring and checking the win conditions. In future labs I plan on adding those features as well as some other fun stuff.</h3>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.options {
  display: flex;
  justify-content: space-evenly;
  margin: 64px 20%;
}

.options button {
  font-size: 2ch;
}
</style>