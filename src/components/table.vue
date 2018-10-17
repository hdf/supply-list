<template>
  <table>
    <thead>
      <tr>
        <th v-for="key in columns"
          @click="key.sortable ? sortBy(key.field) : {}"
          :class="{ active: key.sortable && (sortKey == key.field), sortable: key.sortable }" :key="key.field">
          {{ key.title | capitalize }}
          <span v-if="key.sortable" class="arrow" :class="sortOrders[key.field] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(entry, index) in filteredData" :key="index">
        <td v-for="(key, i) in columns" :key="key.field">
          <div v-if="!(columns[i].editing === index)" @dblclick="$set(columns[i], 'editing', (columns[i].editable) ? index : false)" v-html="customFilter(entry[key.field], key.filter) || '&nbsp;'"></div>
          <input v-if="columns[i].editing === index" :style="{width: getWidth(i), textAlign: 'center'}" v-model="entry[key.field]"
            @blur="columns[i].editing = false; $emit('update', {index: entry.id, field: key.field, value: $event.target.value})"
            @keyup.enter="columns[i].editing = false; $emit('update', {index: entry.id, field: key.field, value: $event.target.value})"
            v-observe-visibility="visibilityChanged">
        </td>
        <td :class="[{hidden: true}, hiddenClass]">
          <slot :item="entry"></slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'tbl',
  props: {
    data: Array,
    columns: Array,
    filterKey: String,
    hiddenClass: ''
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key.field] = 1
    })
    if (this.$route.query.sort && sortOrders[this.$route.query.sort] &&
       (this.$route.query.direction === 1 || this.$route.query.direction === -1)) {
      sortOrders[this.$route.query.sort] = this.$route.query.direction
    }
    return {
      sortKey: this.$route.query.sort || '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    toDate (str) {
      if (typeof str === 'number') {
        return this.moment(str, 'YYYY.MM.DD. HH:mm') + '<br>(' + this.toUntil(str) + ')'
      }
      return str
    },
    toUntil (str) {
      if (typeof str === 'number') {
        return this.moment(str, 'from', 'now')
      }
      return str
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
      this.$router.replace({query: {sort: key, direction: this.sortOrders[key]}})
    },
    visibilityChanged (isVisible, entry) {
      if (isVisible) {
        entry.target.focus()
        entry.target.setSelectionRange(0, 0)
      }
    },
    getWidth (i) {
      return document.querySelectorAll('th')[i].clientWidth - 50 + 'px'
    },
    customFilter (str, filter) {
      if (typeof filter === 'function') {
        return filter(str)
      } else if (this.$options.filters[filter]) {
        return this.$options.filters[filter](str)
      }
      return str
    }
  }
}
</script>

<style scoped>
body {
  font-family: Helvetica Neue, Arial, sans-serif;
  font-size: 14px;
  color: #444;
}

table {
  border: 2px solid #ccc;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.5);
  margin: auto;
}

th {
  background-color: rgba(238,238,238,0.9);
  color: rgba(0,0,0,0.66);
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: rgba(249,249,249,0.66);
}

th, td {
  /*min-width: 120px;*/
  padding: 10px 20px;
}

th.active {
  color: #000;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #aaa;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #aaa;
}

.sortable {
  cursor: pointer;
}

[class="hidden"] {
  display: none !important;
}

.hidden {
  display: table-cell;
  padding: 0 6px 0 6px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.66);
  border-radius: 5px;
}

.hidden:hover {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
