import * as axios from 'axios';
import "./output.css";
import { useState, useEffect } from 'react';
import { md5 } from 'js-md5';
import { message } from 'antd';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
export default function Project() {
    const client = axios.default;
    const uid = window.sessionStorage.getItem('uid');
    const Password = window.sessionStorage.getItem('Password');
    const ProjectID = window.sessionStorage.getItem('ProjectID');
    const ProjectName = window.sessionStorage.getItem('ProjectName');
    let Name = window.sessionStorage.getItem('Name');
    const [missionList, setMissionList] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(() => {
        const fetchData = async () => {
            const ProjectID = window.sessionStorage.getItem('ProjectID');
            axios.default.get('http://127.0.0.1:7001/mission/getlist/', { params: {
                ProjectID: ProjectID
            } }).then(response => {
            const data = response.data;
            setMissionList(data);
          });
        };
        fetchData();
      }, []);
      async function changeName()
      {
          const newName = prompt("请输入新的名字");
          if(newName === null || newName === "")
          {
            messageApi.open({
                type: 'error',
                content: '名字不能为空',
              });
              return;
          }
          window.sessionStorage.setItem('Name', newName);
          const NewNamePost = new URLSearchParams();
          NewNamePost.append('Name', newName);
          NewNamePost.append('uid', uid);
          client.post('http://127.0.0.1:7001/userinfo/changename/', NewNamePost).then(function (response) {
              console.log(response);
          });
          window.location.reload();
      }
      async function changePassword()
      {
          const oldPassword = prompt("请输入旧密码");
          const newPassword = prompt("请输入新密码");
          const confirmPassword = prompt("请再次输入新密码");
          if(oldPassword === null || oldPassword === "" || newPassword === null || newPassword === "" || confirmPassword === null || confirmPassword === "")
            {
                messageApi.open({
                    type: 'error',
                    content: '密码不能为空',
                  });
                return;
            }
            if(md5(oldPassword) !== Password)
            {
                messageApi.open({
                    type: 'error',
                    content: '旧密码错误',
                  });
                return;
            }
            if(newPassword !== confirmPassword)
            {
                messageApi.open({
                    type: 'error',
                    content: '两次输入的密码不一致',
                  });
                return;
            }
          window.sessionStorage.setItem('Password', md5(newPassword));
          const NewPasswordPost = new URLSearchParams();
          NewPasswordPost.append('Password', md5(newPassword));
          NewPasswordPost.append('uid', uid);
          client.post('http://127.0.0.1:7001/userinfo/changepassword/', NewPasswordPost).then(function (response) {
              console.log(response);
          });
      }
    async function handleEditProjectName()
    {
        const newName = prompt("请输入新的项目名");
        if(newName === null || newName === "")
        {
            messageApi.open({
                type: 'error',
                content: '项目名不能为空',
              });
            return;
        }
        window.sessionStorage.setItem('ProjectName', newName);
        const NewNamePost = new URLSearchParams();
        NewNamePost.append('ProjectName', newName);
        NewNamePost.append('ProjectID', ProjectID);
        client.post('http://127.0.0.1:7001/project/editname/', NewNamePost).then(function (response) {
            console.log(response);
            window.location.reload();
        });
    }
    async function handleAddMission()
    {
        const MissionName = prompt("请输入任务名");
        if(MissionName === null || MissionName === "")
        {
            messageApi.open({
                type: 'error',
                content: '任务名不能为空',
              });
            return;
        }
        let MissionDescription = prompt("请输入任务描述");
        if(MissionDescription === null || MissionDescription === "") MissionDescription = "无";
        const NewMissionPost = new URLSearchParams();
        NewMissionPost.append('ProjectID', ProjectID);
        NewMissionPost.append('MissionID', Math.floor(Math.random() * 10000));
        NewMissionPost.append('MissionName', MissionName);
        NewMissionPost.append('MissionDescription', MissionDescription);
        NewMissionPost.append('MissionStatus', '未完成');
        NewMissionPost.append('Date', new Date());
        client.post('http://127.0.0.1:7001/mission/add/', NewMissionPost).then(function () {
            window.location.reload();
        });
    }
    async function handleRemoveMission(event)
    {
        const MissionID = event.target.parentNode.id;
        client.delete('http://127.0.0.1:7001/mission/remove/', { params: {
            MissionID: MissionID
        }}).then(function (response) {
            console.log(response);
            window.location.reload();
        }
    )}
    async function handleSelectMission(event)
    {
        const MissionID = event.target.id;
        const MissionName = event.target.childNodes[0].childNodes[0].innerText;
        window.sessionStorage.setItem('MissionID', MissionID);
        window.sessionStorage.setItem('MissionName', MissionName);
        window.location.href = './mission';
    }
    function Middle()
    {
        return (
            <>
            <div className="flex-col justify-start text-white font-semibold">
                <div id="project-info-box" className="bg-zinc-500 flex flex-row items-center justify-between left-1/5 top-0 py-6 px-6 shadow-lg">
                    <div><p id="project-name" className="text-5xl">{ProjectName}</p></div>
                    <div onClick={handleEditProjectName} className='text-5xl'><EditOutlined /></div>
                </div>
                <div>
                    <div>
                        {missionList.map((mission, index) => (
                            <div key={index} id={mission.MissionID} onClick={handleSelectMission} className="mt-1 flex flex-row items-center shadow-lg justify-between bg-white hover:bg-zinc-300 duration-75 font-semibold text-black py-2 px-6 border-2 rounded-2xl">
                                <div><p id="mission-name" className="text-3xl">{mission.MissionName}</p></div>
                                <div onClick={handleRemoveMission} className="relative text-2xl border-black border rounded-full bg-transparent hover:border-purple-400 hover:bg-purple-400 duration-75 py-1 px-2">删除</div>
                            </div>
                        ))}
                        <div id="add-box" onClick={handleAddMission} className="mt-1 flex flex-row items-center shadow-lg justify-between bg-white hover:bg-zinc-300 duration-75 font-semibold text-black py-2 px-6 border-2 rounded-2xl">
                            <div className="text-3xl"><PlusCircleOutlined/></div>
                            <p id="add-text" className="text-3xl">&nbsp;&emsp;添加任务</p>
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
    }
    return (
        <>
            {contextHolder}
            <div className="divide-x flex">
                <div id="left" className="w-1/5 h-screen bg-zinc-400 border-r-zinc-600 border">
                    <div className="flex-col justify-start text-white font-semibold">
                        <div id="user-info-box" className="bg-zinc-500 flex flex-row items-center justify-between left-0 top-0 py-2 px-4 shadow-lg">
                            <div className='shrink'><p id="user-name" className=" text-5xl">{Name}</p></div>
                            <div className="flex flex-col shrink-0">
                                <div onClick={changeName} className="text-2xl border-white border rounded-full bg-transparent hover:border-purple-400 hover:bg-purple-400 duration-75 py-1 px-2">修改昵称</div>
                                <div onClick={changePassword} className="text-2xl border-white border rounded-full bg-transparent hover:border-purple-400 hover:bg-purple-400 duration-75 py-1 px-2">修改密码</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="center" className="w-2/5 h-screen bg-zinc-300 border-r-zinc-600 border"><Middle /></div>
                <div id="right" className="w-2/5 h-screen bg-zinc-200 border-solid"></div>
            </div>
        </>
    );
}