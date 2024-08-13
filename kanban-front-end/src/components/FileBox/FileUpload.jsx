import { InboxOutlined } from '@ant-design/icons';
import '../../output.css';
import { Progress, Upload } from 'antd';
import * as axios from 'axios';
import { useState } from 'react';
const client = axios.default;
const { Dragger } = Upload;
const twoColors = {
  '0%': '#108ee9',
  '100%': '#87d068',
};
export default function FileUpload() {
  const [percent, setPercent] = useState(0);
  function handleUpload(info) {
  window.sessionStorage.setItem('filename', info.file.name);
  const uploadFormData = new FormData();
  uploadFormData.append('MissionID', window.sessionStorage.getItem('MissionID'));
  uploadFormData.append('File', info.file);
  uploadFormData.append('Date', new Date());
  client.post('http://127.0.0.1:7001/file/upload/', uploadFormData, 
    {
      onUploadProgress: ({ total, loaded }) => {
        setPercent(Math.round((loaded * 100) / total));
      },
    }
  ).then(function (response) {
    console.log(response);
  });
}
  return (
    <>
    <div className='bg-white shadow-lg rounded-lg'>
      <Dragger 
          multiple ={true}
          showUploadList={false}
          customRequest={handleUpload}
      >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
      </Dragger></div>
      <div className='shadow-lg'><Progress percent={percent} strokeColor={twoColors}/></div>
    </>
  );
}