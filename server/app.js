import express from 'express'
import mp3 from 'youtube-mp3-downloader'
import ffmpeg from 'ffmpeg-static'
const app = express()

const PORT = 5000

const downloadPath = process.env.USERPROFILE + '/Downloads'

const yd = new mp3({
  ffmpegPath: ffmpeg,
  outputPath: downloadPath,
  youtubeVideoQuality: 'highestaudio',
})
yd.download('RqqYRon0sjE')

yd.on('progress', function (progress) {
  console.log(progress.progress.percentage)
})

yd.on('finished', function (err, data) {
  console.log('music downloaded')
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
