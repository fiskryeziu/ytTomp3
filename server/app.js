import ytdl from 'ytdl-core'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
const port = process.env.PORT || 5000

let clientGlob = null

const getAudio = (videoURL, res) => {
  // console.log(videoURL)
  // console.log(res)
  let stream = ytdl(videoURL, {
    quality: 'highestaudio',
    filter: 'audioonly',
  })
    .on('progress', (chunkSize, downloadedChunk, totalChunk) => {
      clientGlob.emit('progressEventSocket', [
        (downloadedChunk * 100) / totalChunk,
      ])
      clientGlob.emit('downloadCompletedServer', [downloadedChunk])
      if (downloadedChunk == totalChunk) {
        console.log('Downloaded')
      }
    })
    .pipe(res)

  ytdl.getInfo(videoURL).then((info) => {
    clientGlob.emit('videoDetails', [
      info.videoDetails.title,
      info.videoDetails.author.name,
    ])
  })
}

app.post('/', (req, res) => {
  getAudio(req.body.url, res)
  // console.log(req.body.url)
})

io.on('connection', (client) => {
  clientGlob = client
  console.log('User connected')
})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
