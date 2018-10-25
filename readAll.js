module.exports = () => {
  let content = ''
  process.stdin.resume()
  process.stdin.setEncoding('utf-8')
  process.stdin.on('data', (buf) => { content += buf.toString() })

  return new Promise((res, rej) => {
    process.stdin.on('end', () => res(content))
  })
}
