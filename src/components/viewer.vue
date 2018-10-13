<template>
  <div>
    <login></login>
    <img v-show="dbState.img" :src="dbState.img" id="photo">
    <h1 v-show="dbState.name" class="userName">{{dbState.name}}</h1>
    <!-- <div class="box" v-show="dbState.items"><pre style="text-align: left;">{{dbState.items}}</pre></div><br> -->
    <br>
    <tbl :data="gridData"
         :columns="gridColumns"
         :filter-key="searchQuery"
         v-show="dbState.items"
         hiddenClass="viewer">
      <template slot-scope="{ item }">
        <span @click="check(item.id)" title="Megvéve">&check;</span>
      </template>
    </tbl>
    <modal name="bought"
           :classes="['v--modal']"
           width="200px"
           height="auto"
           :pivotY="0.4"
           @opened="pop">
      <div class="amount-dialog">
        <form @submit="bought">
          <label for="amount">Vett mennyiség: &nbsp;</label>
          <input type="text" id="amount"
                 pattern="[0-9]+"
                 maxlength="3" minlength="1" value="1" size="2" required />
          <br><br>
          <input type="submit" class="btn" value="Megvéve!" />
          <input type="button" @click="$modal.hide('bought')" class="btn" value="Mégse" />
        </form>
      </div>
    </modal>
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
        {title: 'Legközelebb kell', field: 'next', sortable: true},
        {title: 'Milyen gyakran kell', field: 'often', sortable: true},
        {title: 'Tárgy', field: 'name', sortable: true},
        {title: 'Bolt', field: 'shop', sortable: true},
        {title: 'Ár', field: 'price', sortable: true}
      ],
      searchQuery: ''
    }
  },
  computed: {
    gridData () {
      return (this.dbState.items) ? this.dbState.items.filter((v) => v.requested).map((v, i) => {
        return {next: 'most', often: 'nincs elég adat', name: v.name, shop: v.shop, price: v.price, id: i}
      }) : []
    }
  },
  methods: {
    pop () {
      document.getElementById('amount').focus()
    },
    bought () {
      this.dbState.items[this.$modal.id].requested = false
      this.dbState.items[this.$modal.id].boughtTimes.push({
        amount: document.getElementById('amount').value,
        date: Date.now()
      })
      this.userRef.update(this.dbState)
      this.$modal.hide('bought')
    },
    check (id) {
      this.$modal.id = id
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
  padding: 5px 20px 10px 20px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  text-align: left;
  font-size: 120%;
  text-shadow: 1px 1px #444;
  font-family: "Open Sans", sans-serif;
  overflow: scroll;
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
