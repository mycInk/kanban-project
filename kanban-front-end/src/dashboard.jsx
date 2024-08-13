import { message } from "antd";
import "./output.css";
import * as axios from "axios";
import { md5 } from 'js-md5';
import { useEffect, useState } from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
export default function Dashboard() {
    let Name = window.sessionStorage.getItem('Name');
    const client = axios.default;
    const [projectList, setprojectList] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    let Password = window.sessionStorage.getItem('Password');
    let uid = window.sessionStorage.getItem('uid');
    useEffect(() => {
        const fetchData = async () => {
            axios.default.get('http://127.0.0.1:7001/project/getlist/').then(response => {
            const data = response.data;
            setprojectList(data);
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
    async function handleAddProject()
    {
        const projectName = prompt("请输入项目名");
        if(projectName === null || projectName === "")
        {
            messageApi.open({
                type: 'error',
                content: '项目名不能为空',
              });
            return;
        }
        const NewProjectPost = new URLSearchParams();
        NewProjectPost.append('uid', uid);
        NewProjectPost.append('ProjectID', Math.floor(Math.random()*1000000));
        NewProjectPost.append('ProjectName', projectName);
        NewProjectPost.append('Date', new Date());
        client.post('http://127.0.0.1:7001/project/add/', NewProjectPost).then(function (response) {
            console.log(response);
            window.location.reload();
        });
        
    }
    async function handleRemoveProject(e)
    {
        const ProjectID = e.target.parentNode.id;
        client.delete('http://127.0.0.1:7001/project/remove/', { params: {
            ProjectID: ProjectID,
        }}).then(function (response) {
            console.log(response);
            window.location.reload();
        });
    }
    async function handleSelectProject(e)
    {
        const ProjectID = e.target.id;
        const ProjectName = e.target.childNodes[0].childNodes[0].innerText;
        window.sessionStorage.setItem('ProjectID', ProjectID);
        window.sessionStorage.setItem('ProjectName', ProjectName);
        window.location.href = './project';
    }
    function Left()
    {
        return (
            <>
            <div className="flex-col justify-start text-white font-semibold">
                <div id="user-info-box" className="bg-zinc-500 flex flex-row items-center justify-between left-0 top-0 py-2 px-4 shadow-lg">
                    <div className="shrink"><p id="user-name" className=" text-5xl">{Name}</p></div>
                    <div className="flex flex-col shrink-0">
                        <div onClick={changeName} className="text-2xl border-white border rounded-full bg-transparent hover:border-purple-400 hover:bg-purple-400 duration-75 py-1 px-2">修改昵称</div>
                        <div onClick={changePassword} className="text-2xl border-white border rounded-full bg-transparent hover:border-purple-400 hover:bg-purple-400 duration-75 py-1 px-2">修改密码</div>
                    </div>
                </div>
                <div>
                    <div className="text-black">
                        {projectList.map((project, index) => (
                            <div key={index} id={project.ProjectID} onClick={handleSelectProject} className="mt-1 flex flex-row shadow-lg items-center justify-between bg-white hover:bg-zinc-300 duration-75 font-semibold py-2 px-4 border-2 rounded-2xl">
                                <div><p id="project-name" className="text-2xl">{project.ProjectName}</p></div>
                                <div onClick={handleRemoveProject} className="relative text-2xl border-black border rounded-full bg-transparent hover:border-purple-400 hover:bg-purple-400 duration-75 py-1 px-2">删除</div>
                            </div>
                        ))}
                        <div id="add-box" onClick={handleAddProject} className="mt-1 flex flex-row shadow-lg items-center justify-between bg-white hover:bg-zinc-300 duration-75 font-semibold text-3xl py-2 px-4 border-2 rounded-2xl">
                            <div className="text-3xl"><PlusCircleOutlined/></div>
                            <p id="add-text">&nbsp;&emsp;添加项目</p>
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
                <div id="left" className="w-1/5 h-screen bg-zinc-400 border-r-zinc-600 border"><Left /></div>
                <div id="center" className="w-2/5 h-screen bg-zinc-300 border-r-zinc-600 border"></div>
                <div id="right" className="w-2/5 h-screen bg-zinc-200 border-solid"></div>
            </div>
        </>
    );
}