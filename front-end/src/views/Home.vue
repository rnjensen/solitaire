<template>
  <div class="home">
    <h1>Solitaire in Vue</h1>
    <div class="options">
      <button><router-link to="/play">New Game</router-link></button>
      <button><router-link to="/scores">View High Scores</router-link></button>
    </div>

    <h3>Recent updates:</h3>
    <ul class="updates">
      <li>Double click now sends card up to scored piles (if possible)</li>
      <li>Scoring working</li>
      <li>High scores saved to database and displayed on scores page</li>
      <li>Upon victory you may enter a username and avatar to save (don't upload avatar for random robot one)</li>
      <li>General bug fixes</li>
    </ul>
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

.updates {
  width: fit-content;
  margin: auto;
  text-align: left;
}
</style>