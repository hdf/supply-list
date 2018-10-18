export default {
  methods: {
    sorter (a, b) {
      let a2 = a.date
      let b2 = b.date
      return (a2 === b2 ? 0 : a2 > b2 ? 1 : -1)
    },
    prep (v) {
      let last = this.$t('never')
      if (v.boughtTimes.length > 0) {
        last = Math.max(...v.boughtTimes.map(o => o.date), 0)
      }

      let often = this.$t('insufficient_data')
      let next = this.$t('now')
      if (v.boughtTimes.length > 1) {
        let l = v.boughtTimes.length
        // l = (l > 10) ? 10 : l
        let boughtTimes = v.boughtTimes.sort(this.sorter).slice(-l)
        let dates = boughtTimes.map(o => o.date)
        dates.unshift(v.created)
        let naiveDistances = boughtTimes.map((d, i2) => (d.date - dates[i2]) / d.amount)
        naiveDistances = naiveDistances.sort(this.sorter).slice(Math.floor(l / 4), Math.floor(l / 4) + Math.ceil(l / 2))
        let naiveDistance = naiveDistances.reduce((acc, d) => acc + d, 0) / naiveDistances.length
        let squareDiffs = naiveDistances.map(d => Math.pow(d - naiveDistance, 2))
        often = Math.sqrt(squareDiffs.reduce((acc, d) => acc + d, 0) / squareDiffs.length)

        next = last + often
      }
      return [last, often, next]
    }
  }
}
