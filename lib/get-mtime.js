module.exports = filename =>
  Number(statSync(filename).mtime)
