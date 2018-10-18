<template>
  <div>
    <login></login>
    <img v-show="dbState.img" :src="dbState.img" id="photo">
    <h1 v-show="dbState.name" class="userName">{{dbState.name}}</h1>
    <p class="lastChanged" v-if="dbState.lastChange">{{ $t('lastChanged') }}:
      <span :title="dbState.lastChange | moment('from', 'now')">
        {{ dbState.lastChange | moment("YYYY.MM.DD. HH:mm:ss") }}
      </span>
    </p>
    <!-- <div class="box" v-show="dbState.items"><pre style="text-align: left;">{{dbState.items}}</pre></div><br> -->
    <br>

    <tbl :data="gridData"
         :columns="gridColumns"
         :filter-key="searchQuery"
         v-show="dbState.items"
         hiddenClass="viewer">
      <template slot-scope="{ item }">
        <span @click="check(item.id)" :title="$t('bought')">&check;</span>
      </template>
    </tbl>

    <modal name="bought"
           :classes="['v--modal']"
           width="200px"
           height="auto"
           :pivotY="0.4"
           @opened="pop">
      <div class="amount-dialog">
        <p v-if="modalId !== null">{{dbState.items[modalId].name}}</p>
        <form @submit="bought">
          <label for="amount">{{ $t('bought_amount') }}:&nbsp;</label>
          <input type="text" id="amount"
                 pattern="[0-9]+"
                 maxlength="3" minlength="1" value="1" size="2" required />
          <br><br>
          <input type="submit" class="btn" :value="$t('bought') + '!'" />
          <input type="button" @click="$modal.hide('bought')" class="btn" :value="$t('cancel')" />
        </form>
      </div>
    </modal>
    <br>

    <div class="box" v-if="dbState.items">
      {{ $t('total') }}: {{ sum }}
    </div>
  </div>
</template>

<script>
import login from './login'
import { db } from '../main'
import tbl from './table'

export default {
  name: 'viewer',
  components: {
    login, tbl
  },
  data () {
    return {
      userRef: {},
      dbState: {},
      gridColumns: [
        {title: this.$t('last_title'), field: 'last', sortable: true, filter: 'toDate'},
        {title: this.$t('next_title'), field: 'next', sortable: true, filter: 'toUntil'},
        {title: this.$t('often_title'), field: 'often', sortable: true},
        {title: this.$t('name_title'), field: 'name', sortable: true},
        {title: this.$t('shop_title'), field: 'shop', sortable: true},
        {title: this.$t('price_title'), field: 'price', sortable: true}
      ],
      searchQuery: '',
      modalId: null
    }
  },
  computed: {
    gridData () {
      return (this.dbState.items) ? this.dbState.items.map((v, i) => {
        let last = this.$t('never')
        if (v.boughtTimes.length > 0) {
          last = Math.max(...v.boughtTimes.map(o => o.date), 0)
        }
        return {
          last: last,
          next: this.$t('now'),
          often: this.$t('insufficient_data'),
          name: v.name,
          shop: v.shop,
          price: v.price,
          id: i
        }
      }).filter((v, i) => this.dbState.items[i].requested) : []
    },
    sum () {
      return (this.dbState.items) ? this.dbState.items.reduce((acc, v) => acc + ((v.requested) ? parseFloat(v.price) : 0), 0) : ''
    }
  },
  methods: {
    pop () {
      document.getElementById('amount').focus()
      document.getElementById('amount').setSelectionRange(0, document.getElementById('amount').value.length)
    },
    bought () {
      this.dbState.items[this.modalId].requested = false
      this.dbState.items[this.modalId].boughtTimes.push({
        amount: document.getElementById('amount').value,
        date: Date.now()
      })
      this.dbState.lastChange = Date.now()
      this.userRef.update(this.dbState)
      this.$modal.hide('bought')
    },
    check (id) {
      this.modalId = id
      this.$modal.show('bought')
    }
  },
  mounted () {
    this.userRef = db.collection('users').doc(this.$route.params.user)
    this.userRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        this.userRef.onSnapshot(doc => {
          this.dbState = doc.data()
        })
      } else {
        this.$router.replace('/')
      }
    })
  }
}
</script>

<style scoped>
#photo {
  margin-top: 25px;
  margin-bottom: -10px;
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
  max-width: 120px;
}
.box {
  margin: auto;
  width: 50%;
  padding: 5px 20px 5px 20px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  text-align: left;
  font-size: 120%;
  text-shadow: 1px 1px #444;
  font-family: "Open Sans", sans-serif;
  /* overflow: scroll; */
}
.amount-dialog {
  padding: 10px;
  text-align: center;
  overflow: auto;
}
.btn:nth-last-child(2) {
  float: left;
}
.btn:last-child {
  float: right;
}
</style>

<style>
.hidden.viewer {
  color: red;
  font-size: 1.5em;
}
</style>
