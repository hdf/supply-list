<template>
  <div>
    <img :src="user.photoURL" id="photo">
    <h1 class="userName">{{dbState.name || user.displayName}}</h1>
    <p class="lastChanged" v-if="dbState.lastChange">{{ $t('lastChanged') }}:
      <span :title="dbState.lastChange | moment('from', 'now')">
        {{ dbState.lastChange | moment("YYYY.MM.DD. HH:mm:ss") }}
      </span>
    </p><br>
    <button @click="logOut" style="padding: 3px 5px 3px 4px;">{{ $t('logout') }}</button><br>
    <br>
    <input type="button" @click="$modal.show('add')" class="add_btn" :value="$t('add_new')" />
    <br><br>
    <tbl :data="gridData"
         :columns="gridColumns"
         :filter-key="searchQuery"
         v-show="dbState.items"
         hiddenClass="editor"
         @update="update">
      <template slot-scope="{ item }">
        <div class="hidden_container">
          <span @click="more(item.id)" class="more" :title="$t('more')">&rtrif;</span>
          <span @click="del(item.id)" class="del" :title="$t('delete')">&cross;</span>
          <span @click="req(item.id)" class="req" :title="$t('request')" v-if="!item.requested">&plus;</span>
        </div>
      </template>
    </tbl>
    <modal name="add"
           :classes="['v--modal']"
           width="260px"
           height="auto"
           :pivotY="0.3"
           @opened="pop">
      <div class="add-dialog">
        <form @submit="add">
          <label for="itemName">{{ $t('name') }}: &nbsp;</label>
          <input type="text" id="itemName"
                 minlength="2" size="20" required />
          <br><br>
          <label for="price">{{ $t('price_title') }}: &nbsp;</label>
          <input type="text" id="price"
                 pattern="[0-9]+"
                 minlength="2" size="20" required />
          <br><br>
          <label for="shop">{{ $t('shop_title') }}: &nbsp;</label>
          <input type="text" id="shop" size="20" />
          <br><hr>
          <input type="submit" class="btn" :value="$t('add')" />
          <input type="button" @click="$modal.hide('add')" class="btn" :value="$t('cancel')" />
        </form>
      </div>
    </modal>
    <br>
    <div class="box" v-if="dbState.items">
      <div>{{ $t('weekly') }}:&nbsp;</div><div>{{ weekly }}</div>
      <div>{{ $t('monthly') }}:&nbsp;</div><div>{{ monthly }}</div>
      <div>{{ $t('yearly') }}:&nbsp;</div><div>{{ yearly }}</div>
    </div>
  </div>
</template>

<script>
import { db } from '../main'
import tbl from './table'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name: 'edit',
  components: {
    tbl
  },
  data () {
    return {
      user: {},
      userRef: {},
      dbState: {},
      gridColumns: [
        {title: this.$t('last_title'), field: 'last', sortable: true, filter: 'toDate'},
        {title: this.$t('next_title'), field: 'next', sortable: true, filter: 'toUntil'},
        {title: this.$t('often_title'), field: 'often', sortable: true},
        {title: this.$t('name_title'), field: 'name', sortable: true, editable: true},
        {title: this.$t('shop_title'), field: 'shop', sortable: true, editable: true},
        {title: this.$t('price_title'), field: 'price', sortable: true, editable: true}
      ],
      searchQuery: ''
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
          requested: v.requested,
          id: i
        }
      }) : []
    },
    weekly () {
      return (this.dbState.items) ? this.dbState.items.reduce((acc, v) => acc + parseFloat(v.price), 0) : ''
    },
    monthly () {
      return (this.dbState.items) ? this.dbState.items.reduce((acc, v) => acc + parseFloat(v.price), 0) : ''
    },
    yearly () {
      return (this.dbState.items) ? this.dbState.items.reduce((acc, v) => acc + parseFloat(v.price), 0) : ''
    }
  },
  methods: {
    logOut () {
      firebase.auth().signOut().then(() => {
        this.$router.replace('/view/' + this.user.uid)
      })
    },
    DbInit () {
      this.userRef = db.collection('users').doc(this.user.uid)
      this.userRef.get().then((docSnapshot) => {
        if (docSnapshot.exists) {
          this.userRef.onSnapshot((doc) => {
            this.dbState = doc.data()
          })
        } else {
          this.userRef.set({
            name: this.user.displayName,
            img: this.user.photoURL,
            items: [],
            created: Date.now(),
            lastChange: Date.now()
          })
        }
      })
    },
    updateDb () {
      this.dbState.lastChange = Date.now()
      this.userRef.update(this.dbState)
    },
    more (id) {
    },
    del (id) {
      this.dbState.items.splice(id, 1)
      this.updateDb()
    },
    req (id) {
      this.dbState.items[id].requested = true
      this.updateDb()
    },
    add () {
      this.dbState.items.push({
        name: document.getElementById('itemName').value.trim(),
        price: parseFloat(document.getElementById('price').value.trim()),
        shop: document.getElementById('shop').value.trim(),
        requested: true,
        boughtTimes: []
      })
      this.updateDb()
      this.$modal.hide('add')
    },
    pop () {
      document.getElementById('itemName').focus()
    },
    update (obj) {
      this.dbState.items[obj.index][obj.field] = (obj.field === 'price') ? parseFloat(obj.value.trim()) : obj.value.trim()
      this.userRef.update(this.dbState)
    }
  },
  mounted () {
    if (!firebase.auth().currentUser) {
      this.$router.replace('/')
    } else {
      this.user = firebase.auth().currentUser
      this.DbInit()
    }
  }
}
</script>

<style scoped>
#photo {
  margin-top: 25px;
  margin-bottom: -10px;
  border-radius: 50%;
  box-shadow: 0 0 3px rgba(0, 0, 0, .6);
  max-width: 120px;
}
.add-dialog {
  padding: 10px;
  overflow: auto;
}
.btn:nth-last-child(2), .add-dialog label {
  float: left;
}
.btn:last-child, .add-dialog input[type="text"] {
  float: right;
}
.add_btn {
  font-family: Arial, Helvetica, sans-serif;
  padding: 10px 15px 10px 15px;
  font-size: 150%;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
}
hr {
  margin: 15px 0px 10px 0px;
  height: 1px;
  border: none;
  background-color: #333;
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
  display: inline-grid;
  grid-template-columns: max-content max-content;
}
</style>

<style>
.hidden.editor {
  font-size: 1.5em;
}
.hidden.editor span:hover {
  box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
}
.hidden_container {
  float: left;
}
.del {
  color: red;
}
.req {
  color: green;
}
</style>
