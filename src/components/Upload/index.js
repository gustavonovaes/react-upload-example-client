import React, { Component } from 'react'

import Dropzone from 'react-dropzone'

import { DropContainer, UploadMessage } from './styles'

export default class Upload extends Component {
  render() {
    const { onUpload } = this.props

    return (
      <Dropzone accept="image/*" onDropAccepted={onUpload}>
        {this.renderDragContainer}
      </Dropzone>
    )
  }

  renderDragContainer = ({
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  }) => (
      <DropContainer
        {...getRootProps()}
        isDragActive={isDragActive}
        isDragReject={isDragReject}
      >
        <input {...getInputProps()} />
        {this.renderDragMessage({
          isDragActive,
          isDragReject,
        })}
      </DropContainer>
    )

  renderDragMessage = ({ isDragActive, isDragReject }) => {
    if (!isDragActive) {
      return <UploadMessage>Arraste arquivos aqui...</UploadMessage>
    }

    if (isDragReject) {
      return <UploadMessage type="error">Arquivo inválido!</UploadMessage>
    }

    return <UploadMessage type="success">Solte arquivos aqui...</UploadMessage>
  }
}
