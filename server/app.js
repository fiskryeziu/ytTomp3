import ytdl from 'ytdl-core'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import ffmpeg from 'fluent-ffmpeg'
import ffmpeginstaller from '@ffmpeg-installer/ffmpeg'
import fs from 'fs'

const downloadFolder = process.env.USERPROFILE + '/Downloads'

console.log(downloadFolder)
const ffmpegPath = ffmpeginstaller.path
ffmpeg.setFfmpegPath(ffmpegPath)

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

const getAudio = async (videoURL, res) => {
  const title = await ytdl.getInfo(videoURL).then((info) => {
    return info.videoDetails.title
  })
  let writeStream = fs.createWriteStream(`${downloadFolder}/${title}.mp3`)

  let stream = ytdl(videoURL, { filter: 'audioonly' })
  ffmpeg(stream)
    .audioCodec('libmp3lame')
    .audioBitrate(128)
    .format('mp3')
    // .save(downloadFolder + title + '.mp3')
    .on('error', (err) => console.error(err))
    .on('end', () => console.log('Finished!'))
    .pipe(writeStream)
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
