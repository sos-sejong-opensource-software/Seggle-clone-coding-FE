function UTCtoKST (gmt) {
  const localeTime = new Date(gmt)
  localeTime.setHours(localeTime.getHours() + 9)

  const time = localeTime.toISOString()
  return time.slice(0, 10) + ' ' + time.slice(11, 19)
}

function formatTime (time) {
  return time.slice(0, 10) + ' ' + time.slice(11, 19)
}

export {
  UTCtoKST,
  formatTime
}
