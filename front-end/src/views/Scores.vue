<template>
  <div class="scores">
    <h1>High scores (top 100)</h1>
    <button @click="edit=!edit">Admin {{edit ? "off" : "on"}}</button>
    <table class="score-table">
      <tr v-for="score in sortedScores" class="score-row" :key="score.id">
          <td>
            <img :src="score.avatar" />
          </td>
          <td>
            <h3 v-if="!edit">{{score.user}}</h3>
            <input v-else type="text" v-model="score.user" />
          </td>
          <td>
            <p v-if="!edit">Score: {{score.score}}</p>
            <input v-else type="number" v-model="score.score" />
          </td>
          <td v-if="edit">
            <button @click="save(score)">Save</button>
            <button @click="remove(score)">Delete</button>
          </td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from "axios"

export default {
  name: 'Home',

  data: function() {
      return {
          scores: [],
          error: "",
          edit: false,
          sortedScores: []
      }
  },
  mounted() {
    this.getScores()
  },
  methods: {
    async getScores() {
      axios.get('/api/scores')
        .then(response => {
          this.scores = response.data
          this.sortedScores = [...this.scores].sort((a,b) => b.score - a.score)
        })
        .catch(err => {
          console.log(err)
        })
    },
    async remove(score) {
      try {
        await axios.delete("/api/scores/" + score._id);
        this.getScores();
      } catch (error) {
        console.log(error);
      }
    },
    async save(score) {
      try {
        await axios.put('/api/scores/' + score._id, {
          user: score.user,
          score: score.score
        })
      }
      catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>

.score-table {
  width: 70%;
  margin-left: 15%;
}

.score-row {
    display: flex;
    justify-content: space-evenly;
    text-align: center;
}

.score-row td {
  width:100%
}

.score-row img {
  max-width: 50px;
}
</style>
