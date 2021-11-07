<template>
  <div class="scores">
    <h1>High scores (top 100)</h1>
    <div v-for="score in sortedScores" class="score-row" :key="score.id">
        <img :src="score.avatar" />
        <h3>{{score.username}}</h3>
        <p>Score: {{score.score}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',

  data: function() {
      return {
          scores: require('../assets/scores.json')
      }
  },
  computed: {
      sortedScores: function() {
          return [...this.scores].sort((a,b) => b.score - a.score)
      }
  }
}
</script>

<style scoped>
.score-row {
    display: flex;
    justify-content: space-evenly;
    text-align: left;
}
</style>
