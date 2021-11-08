<template>
  <div 
    class="play"
    @dragenter.prevent
    @dragover="dragOver($event)"
    @dragend="dragEnd($event)"
  >
    <h1>Play (work in progress)</h1>
    <div class="board-head">
      <div class="scored">
        <div 
          v-for="column, index in scored" :class="scored[index].length ? undefined : 'empty'" 
          :key="index" @dragstart="startDrag($event, index, scored[index].length-1, 'scored')"
          @drop="onDrop($event, index, 'scored')"
        >
          <img 
            
            :src="scored[index].length ? 
            require(`../assets/${scored[index][scored[index].length-1].value}${scored[index][scored[index].length-1].suit}.png`) :
            require('@/assets/purple_back.png')"
          />
        </div>
      </div>
      <div class="deck">
        <div :class="deck.length ? undefined : 'empty'"  @click="drawCard">
          <img src="@/assets/purple_back.png" @dragstart.prevent />
        </div>
        <div :class="drawn.length ? undefined : 'empty'" :draggable="!!drawn.length" @dragstart="startDrag($event, -1, drawn.length-1, 'draw')">
          <img v-if="drawn.length" :src="require(`../assets/${drawn[drawn.length-1].value}${drawn[drawn.length-1].suit}.png`)" />
          <img v-else src="@/assets/purple_back.png" />
        </div>
      </div>
    </div>
    <div class="main-board">
      <div 
        v-for="column, colIndex in columns" class="column" 
        :key="colIndex" 
        @drop="onDrop($event, colIndex, 'column')"
      >
        <div v-if="!column.unflipped.length && !column.flipped.length" class="empty">
          <img src="@/assets/purple_back.png" />
        </div>
        <div v-if="column.unflipped.length" class="unflipped" @click="flipCard(colIndex)">
          <img
            v-for="card, cardIndex in column.unflipped"
            src="@/assets/purple_back.png" 
            class="card"
            :key="cardIndex"
            @dragstart.prevent
          />
        </div>
        <div v-if="column.flipped.length" class="flipped">
          <div
            v-for="card, cardIndex in column.flipped"
            class="card"
            draggable
            @dragstart="startDrag($event, colIndex, cardIndex, 'column')"
            :key="cardIndex"
          >
            <img :src="require(`../assets/${card.value}${card.suit}.png`)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Play',
  mounted: function() {
    let deck = require('../assets/deck.json')
    this.deal(deck)
  },
  data: function() {
    return {
      deck: [],
      drawn: [],
      columns: [],
      activeLocation: null,
      activeSiblings: [],
      cardVals: ['1','2','3','4','5','6','7','8','9','10','J','Q','K'],
      scored: [[],[],[],[]]
    }
  },
  methods: {
    deal(deck) {
      this.shuffle(deck)
      let deckIndex = deck.length-1
      for(let i = 0; i < 7; i++) {
        this.columns.push({unflipped: [], flipped: []})
        for(let j = 0; j < i; j++) {
          this.columns[i].unflipped.push(deck[deckIndex])
          deckIndex--
        }
        this.columns[i].flipped.push(deck[deckIndex])
        deckIndex--
      }
      this.deck.push(...deck.slice(0, deckIndex))
    },
    shuffle(deck) {
      let currentIndex = deck.length,  randomIndex;

      // While there remain elements to shuffle...
      while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [deck[currentIndex], deck[randomIndex]] = [
          deck[randomIndex], deck[currentIndex]];
      }

      return deck;
    },
    flipCard(colIndex) {
      const column = this.columns[colIndex]
      if(!column.flipped.length && column.unflipped.length) {
        const card = column.unflipped[column.unflipped.length-1]
        column.flipped.push(card)
        column.unflipped.pop()
      }
    },
    startDrag(evt, colIndex, cardIndex, source) {
      this.activeLocation = {x: evt.pageX, y: evt.pageY}

      let columnEl = evt.target.parentElement
      if(source === 'column') {
        for(let i = cardIndex; i < columnEl.children.length; i++) {
          this.activeSiblings.push({card: this.columns[colIndex].flipped[i], el: columnEl.children[i]})
        }
      }
      else if(source === 'scored') {
        this.activeSiblings.push({card: this.scored[colIndex][cardIndex], el: evt.target})
      }
      else {
        this.activeSiblings.push({card: this.drawn[cardIndex], el: evt.target})
      }

      evt.dataTransfer.effectAllowed = 'copy'
      let img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
      evt.dataTransfer.setDragImage(img, 0, 0);

      evt.dataTransfer.setData('cardIndex', cardIndex)
      evt.dataTransfer.setData('fromCol', colIndex)
      evt.dataTransfer.setData('source', source)
    },
    dragEnd() {
      this.activeSiblings.forEach(card => {
        console.log('no style')
        card.el.style = undefined
      })
      this.activeLocation = null
      this.activeSiblings = []
    },
    onDrop(evt, colIndex, destType) {
      const column = destType === 'scored' ? this.scored[colIndex] : this.columns[colIndex]
      const cardIndex = evt.dataTransfer.getData('cardIndex')
      const fromColIndex = evt.dataTransfer.getData('fromCol')
      const source = evt.dataTransfer.getData('source')

      if(this.canDrop(this.activeSiblings[0].card, column, destType === 'scored')) {
        if(source === 'column') {
          this.columns[fromColIndex].flipped.splice(cardIndex)
        }
        else if(source === 'scored') {
          this.scored[fromColIndex].pop()
        }
        else {
          this.drawn.pop()
        }
        this.activeSiblings.forEach(card => {
          destType === 'column' ? column.flipped.push(card.card) : this.scored[colIndex].push(card.card)
          console.log(destType)
          // if(fromColIndex > -1) {
          //   console.log('remove', card.card)
          //   // card.el.remove()
          // }
          // else
            card.el.style = undefined
        })
        this.activeSiblings = []
      }
    },
    dragOver(evt) {
      evt.preventDefault()
      evt.dataTransfer.dropEffect = 'over'
			let x = evt.pageX - this.activeLocation.x;
			let y = evt.pageY - this.activeLocation.y;

			let css = "pointer-events: none; transform: scale(1.05, 1.05) rotateX(0deg) translate3d("+x+"px, "+y+"px, 0px);";

			if ( this.activeSiblings.length ) {
				this.activeSiblings.forEach(function(card) {
					card.el.style.cssText = css;
				});
			}
    },
    canDrop(toDrop, column, isScored) {
      if(isScored) {
        if(column.length) {
          const columnCard = column[column.length-1]
          return toDrop.suit === columnCard.suit && (this.cardVals.indexOf(toDrop.value) - this.cardVals.indexOf(columnCard.value)) === 1
        }
      }
      else if(column.flipped.length) {
        const columnCard = column.flipped[column.flipped.length-1]
        let altSuit = false
        if(toDrop.suit === 'D' || toDrop.suit === 'H')
          altSuit = columnCard.suit === 'S' || columnCard.suit === 'C'
        else
          altSuit = columnCard.suit === 'D' || columnCard.suit === 'H'

        if(altSuit) {
          return (this.cardVals.indexOf(columnCard.value) - this.cardVals.indexOf(toDrop.value)) === 1
        }
      }
      return isScored ? toDrop.value === '1' : (!column.unflipped.length && toDrop.value === 'K')
    },
    drawCard() {
      if(this.deck.length) {
        const card = this.deck.pop()
        this.drawn.push(card)
      }
      else {
        this.deck = this.drawn.reverse()
        this.drawn = []
      }
    }
  }
}
</script>

<style scoped>

img {
  max-width: 100px
}

  .board-head {
    display: flex;
    justify-content: space-between;
  }

  .scored {
    display: flex;
    justify-content: left;
    margin: 16px auto 16px 16px;
  }

  .scored div {
    max-width: 100px
  }

  .deck {
    display: flex;
    justify-content: space-around;
    margin: 16px 16px 16px auto;
    width: 250px;
  }

  .deck img {
    max-width: 100px;
  }

  .empty {
    border: black solid;
    border-radius: 8px;
  }

  .empty img {
    opacity: 0;
  }

  .main-board {
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 200px;
  }

  .column {
    width: 100px;
  }

  .card {
    margin-bottom: -120%;
    max-width: 100%;
  }

  .card img {
    pointer-events: none;
    max-width: 100%;
  }
</style>