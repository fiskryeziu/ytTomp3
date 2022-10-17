import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import io from 'socket.io-client'
import ProgressBar from './components/ProgressBar'

const URL = 'localhost:5000'
const socket = io(URL)

const Music = () => {
  const [allData, setAllData] = useState({
    urlText: '',
    percentage: '0',
    blobData: null,
    videoName: '',
  })

  const { urlText, percentage, blobData, videoName } = allData
  const onChange = (e) => {
    setAllData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  useEffect(() => {
    socket.on('progressEventSocket', (data) => {
      setAllData((prev) => ({
        ...prev,
        percentage: data[0],
      }))
    })

    socket.on('downloadCompletedServer', (data) => {
      // console.log(data[0]);
      setAllData((prev) => ({
        ...prev,
        dataToBeDownloaded: data[0],
      }))
    })

    socket.on('videoDetails', (data) => {
      setAllData((prev) => ({
        ...prev,
        videoName: data[0],
      }))
      setAllData((prev) => ({
        ...prev,
        videoUploader: data[1],
      }))
    })
  })
  const submitHandler = async (e) => {
    e.preventDefault()
    setAllData((prev) => ({
      ...prev,
      percentage: '0',
      blobData: null,
      videoName: '',
    }))

    const response = await axios.post('http://localhost:5000/', {
      url: urlText,
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    setAllData((prev) => ({
      ...prev,
      blobData: url,
    }))
  }

  return (
    <div className="bg-slate-900 h-screen w-full flex justify-center flex-col items-center space-y-3">
      <form
        onSubmit={submitHandler}
        className="flex flex-col justify-center items-center space-y-2 w-full"
      >
        <input
          type="text"
          name="urlText"
          value={urlText}
          placeholder="Enter Url"
          required
          onChange={onChange}
          className="rounded-lg p-2 w-3/4"
        />
        <div>
          <button
            type="submit"
            className="p-2 bg-blue-900 rounded-lg text-white"
          >
            Start Process
          </button>
        </div>
      </form>
      <div>
        {videoName !== '' ? (
          <div style={{ marginTop: '10px' }}>
            <h1 className="text-white text-2xl">Title: {videoName}</h1>
          </div>
        ) : (
          ''
        )}
      </div>
      <ProgressBar completed={percentage} />
      <div>
        {blobData !== null ? (
          <div className="flex justify-center items-center flex-col">
            <a href={blobData} download={videoName + '.mp3'}>
              <button className="p-2 bg-blue-600 rounded-md">Download</button>
            </a>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default Music
