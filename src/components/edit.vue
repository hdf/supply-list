<template>
  <div>
    <img :src="user.photoURL" id="photo">
    <h1 class="userName">{{dbState.name || user.displayName}}</h1>
    <button @click="logOut" style="padding: 3px 4px 3px 4px;">Kijelentkezés</button><br>
    <br><br>
    <input type="button" @click="$modal.show('add')" class="add_btn" value="Új elem hozzáadása" />
    <br><br>
    <tbl :data="gridData"
         :columns="gridColumns"
         :filter-key="searchQuery"
         v-show="dbState.items"
         hiddenClass="editor">
      <template slot-scope="{ item }">
        <div class="hidden_container">
          <span @click="more(item.id)" class="more" title="Több">&rtrif;</span>
          <span @click="del(item.id)" class="del" title="Törlés">&cross;</span>
          <span @click="req(item.id)" class="req" title="Kérés" v-if="!item.requested">&plus;</span>
        </div>
      </template>
    </tbl>
    <modal name="add"
           :classes="['v--modal']"
           width="240px"
           height="auto"
           :pivotY="0.3"
           @opened="pop">
      <div class="add-dialog">
        <form @submit="add">
          <label for="itemName">Név: &nbsp;</label>
          <input type="text" id="itemName"
                 minlength="2" size="20" required />
          <br><br>
          <label for="price">Ár: &nbsp;</label>
          <input type="text" id="price"
                 pattern="[0-9]+"
                 minlength="2" size="20" required />
          <br><br>
          <label for="shop">Bolt: &nbsp;</label>
          <input type="text" id="shop" size="20" />
          <br><hr>
          <input type="submit" class="btn" value="Hozzáad" />
          <input type="button" @click="$modal.hide('add')" class="btn" value="Mégse" />
        </form>
      </div>
    </modal>
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
      return (this.dbState.items) ? this.dbState.items.map((v, i) => {
        return {next: 'most', often: 'nincs elég adat', name: v.name, shop: v.shop, price: v.price, requested: v.requested, id: i}
      }) : []
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
            items: []
          })
        }
      })
    },
    more (id) {
    },
    del (id) {
      this.dbState.items.splice(id, 1)
      this.userRef.update(this.dbState)
    },
    req (id) {
      this.dbState.items[id].requested = true
      this.userRef.update(this.dbState)
    },
    add () {
      this.dbState.items.push({
        name: document.getElementById('itemName').value,
        price: document.getElementById('price').value,
        shop: document.getElementById('shop').value,
        requested: true,
        boughtTimes: []
      })
      this.userRef.update(this.dbState)
      this.$modal.hide('add')
    },
    pop () {
      document.getElementById('itemName').focus()
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
