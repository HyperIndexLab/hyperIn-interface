const twitterShare = (content: string) => {
  const url = encodeURIComponent(
    window.location?.origin
  )
  const text = `${content} ${url}`
  const twitter = `https://twitter.com/intent/tweet?text=${text}`
  window.open(twitter, 'blank')
}

export default twitterShare