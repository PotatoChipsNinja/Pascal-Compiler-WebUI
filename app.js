const fs = require('fs')
const { exec } = require('child_process')
const express = require('express')

const app = express()
const port = 3000

app.use('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

function parseAST(ast) {
  let lines = ast.split("\r\n")
  //console.log(lines)
  let tree = []
  for(let i = 0; i < lines.length; i++) {
    let line = lines[i]
    let curr = tree
    while(line[0] == ' ') {
      curr = curr[curr.length-1].children
      line = line.substr(2)
    }
    curr.push({name: line, children: []})
  }
  return tree[0]
}

app.get('/compile', (req, res) => {
  fs.writeFile('input.pas', req.query.program, (err) => {
      let cmd = "compiler.exe -i input.pas -o output.c -t"
      exec(cmd, (err, stdout, stderr) => {
        fs.readFile('output.c', (err, data) => {
          fs.readFile('input.pas.tree.txt', (err, ast) => {
            let resObj = {
              info: stdout,
              ast: parseAST(ast.toString()),
              code: data.toString()
            }
            res.send(resObj)
          })
        })
      })
  })
})

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Web UI listening at http://localhost:${port}`)
})