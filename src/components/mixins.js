export default {
  methods: {
    sorter (a, b) {
      let a2 = a.date
      let b2 = b.date
      return (a2 === b2 ? 0 : a2 > b2 ? 1 : -1)
    }
  }
}
