import React from 'react';
import CircularProgressBar from 'react-circular-progressbar'
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md'

import { Container, FileInfo, Preview } from './styles';

const FileList = ({ files, onDelete }) => (
  <Container>
    {files.map(file => (
      <li key={file.id}>
        <FileInfo>
          <Preview src={file.preview}></Preview>
          <div>
            <strong>{file.name}</strong>
            {!!file.url && (
              <span>{file.readableSize} <button onClick={() => onDelete(file.id)}>Excluir</button></span>
            )}
          </div>
        </FileInfo>

        <div>
          {!file.uploaded && !file.error && (
            <CircularProgressBar
              styles={{
                root: { width: 26 },
                path: { stroke: '#7159c1' }
              }}
              strokeWidth={10}
              percentage={file.progress}
            ></CircularProgressBar>
          )}
              
          {file.url && (
            <a href={file.url} target="_blank" rel="noopener">
              <MdLink style={{ marginRight: 8 }} size={24} color="#222" />
            </a>
          )}
          
          {file.uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
          {file.error && <MdError size={24} color="#e57878" />}
        </div>
      </li>
    ))}
  </Container>
)

export default FileList;
