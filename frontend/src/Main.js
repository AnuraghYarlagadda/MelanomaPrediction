import React, { useState } from 'react'
import axios from 'axios'

const Main = () => {
  const [uploadInput, setuploadInput] = useState('')
  const handleUploadImage = async (ev) => {
    ev.preventDefault()
    const data = new FormData()
    data.append('file', uploadInput.files[0])

    await axios.post('http://127.0.0.1:5000/upload', data, {}).then((res) => {
      // then print response status
      console.log(res)
    })
  }
  return (
    <form onSubmit={handleUploadImage}>
      <div>
        <input
          ref={(ref) => {
            setuploadInput(ref)
          }}
          type='file'
        />
      </div>
      <br />
      <div>
        <button>Upload</button>
      </div>
    </form>
  )
}

export default Main
