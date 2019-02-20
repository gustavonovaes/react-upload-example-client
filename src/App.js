import React, { Component } from 'react'
import { uniqueId } from 'lodash'
import filesize from 'filesize'
import GlobalStyle from './styles/global'

import { Container, Content } from './styles'

import Upload from './components/Upload'
import FileList from './components/FileList'

import api from './services/api'

class App extends Component {
  state = {
    uploadedFiles: [],
  }

  async componentDidMount() {
    const response = await api.get('/posts')

    const uploadedFiles = response.data.map(file => ({
      id: file._id,
      name: file.name,
      readableSize: filesize(file.size),
      preview: file.url,
      uploaded: true,
      url: file.url,
    }))

    this.setState({
      uploadedFiles
    })
  }

  componentWillUnmount() {
    this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview))
  }

  handleDelete = async id => {
    await api.delete(`/posts/${id}`)

    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id)
    })
  }

  handleUpload = files => {
    const { uploadedFiles } = this.state
    const newUploadedFiles = this.parseUploadedFiles(files)

    this.setState({
      uploadedFiles: [...uploadedFiles.concat(newUploadedFiles)]
    }, this.processUploadedFiles)
  }

  parseUploadedFiles = files => {
    return files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      error: false,
      uploaded: false,
      url: null,
    }))
  }

  processUploadedFiles = () => {
    const { uploadedFiles } = this.state

    const pendingFiles = uploadedFiles.filter(file => {
      return !file.uploaded
    })

    pendingFiles.forEach(this.uploadFile)
  }

  uploadFile = file => {
    const data = new FormData()
    data.append('file', file.file, file.name)

    api.post('posts', data, {
      onUploadProgress: e => {
        const percentualProgress = e.loaded / e.total * 100
        const progress = parseInt(Math.floor(percentualProgress))

        this.updateFile(file.id, { progress })
      }
    }).then(response => {
      const { _id: id, url } = response.data

      this.updateFile(file.id, {
        id,
        uploaded: true,
        url
      })
    }).catch(err => {
      this.updateFile(file.id, {
        error: true
      })
    })
  }

  updateFile = (id, data) => {
    const { uploadedFiles } = this.state

    const fileIndex = uploadedFiles.findIndex(file => file.id === id)
    if (fileIndex < 0) {
      throw new Error('Invalid file id')
    }

    const file = uploadedFiles[fileIndex]
    uploadedFiles[fileIndex] = { ...file, ...data }

    this.setState({ uploadedFiles })
  }

  render() {
    const { uploadedFiles } = this.state

    return (
      <Container>
        <GlobalStyle />
        <Content>
          <Upload onUpload={this.handleUpload} />
          {!!uploadedFiles.length && (
            <FileList onDelete={this.handleDelete} files={uploadedFiles} />
          )}
        </Content>
      </Container>
    )
  }
}

export default App
