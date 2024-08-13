import * as axios from 'axios';
import "./output.css";
import { useEffect,useRef,useState } from 'react';
import { md5 } from 'js-md5';
import FileUpload from './components/FileBox/FileUpload.jsx';
import { Button, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
const { TextArea } = Input;
export default function Mission()
{
    const client = axios.default;
    const uid = window.sessionStorage.getItem('uid');
    const Password = window.sessionStorage.getItem('Password');
    const ProjectID = window.sessionStorage.getItem('ProjectID');
    const ProjectName = window.sessionStorage.getItem('ProjectName');
    const MissionID = window.sessionStorage.getItem('MissionID');
    const MissionName = window.sessionStorage.getItem('MissionName');
    const [MissionInfo, setMissionInfo] = useState({});
    const [commentList, setCommentList] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    let UnpublishedComment = '';
    let Name = window.sessionStorage.getItem('Name');
    useEffect(() => {
        const fetchData = async () => {
            const MissionID = window.sessionStorage.getItem('MissionID');
            axios.default.get('http://127.0.0.1:7001/mission/getinfo/', { params: {
                MissionID: MissionID
            }}).then(response => {
                const details = response.data;
                setMissionInfo(details);
                console.log(details);
            });
        };
        fetchData();
    },[]);
    useEffect(() => {
        const FetchData = async () => {
            const MissionID = window.sessionStorage.getItem('MissionID');
            axios.default.get('http://127.0.0.1:7001/comment/getlist/', { params: {
                MissionID: MissionID
            }}).then(response => {
                const data = response.data;
                setCommentList(data);
            });
        };
        FetchData();
    },[]);
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
    async function handleEditMissionName()
    {
        const newName = prompt("请输入新的任务名");
        if(newName === null || newName === "")
        {
            messageApi.open({
                type: 'error',
                content: '任务名不能为空',
              });
            return;
        }
        window.sessionStorage.setItem('MissionName', newName);
        const NewNamePost = new URLSearchParams();
        NewNamePost.append('MissionName', newName);
        NewNamePost.append('MissionID', MissionID);
        client.post('http://127.0.0.1:7001/mission/editname/', NewNamePost).then(function (response) {
            console.log(response);
            window.location.reload();
        });
    }
    async function handleAddComment()
    {
        if(UnpublishedComment === '')
        {
            messageApi.open({
                type: 'error',
                content: '评论不能为空',
              });
            return;
        }
        const NewCommentPost = new URLSearchParams();
        NewCommentPost.append('MissionID', MissionID);
        NewCommentPost.append('Commenter', Name);
        NewCommentPost.append('uid', uid);
        NewCommentPost.append('Content', UnpublishedComment);
        NewCommentPost.append('CommentID', Math.floor(Math.random()*1000000000));
        NewCommentPost.append('Date', new Date());
        client.post('http://127.0.0.1:7001/comment/add/', NewCommentPost).then(function(response) {
            console.log(response);
            window.location.reload();
        });
    }
    function Right()
    {
        return (
            <>
                <div className="flex-col justify-start text-white font-semibold">
                    <div id="mission-info-box" className="bg-zinc-500 flex flex-row items-center justify-between left-0 top-0 py-6 px-4 border shadow-lg">
                        <div><p id="mission-name" className=" text-5xl">{MissionName}</p></div>
                        <div onClick={handleEditMissionName} className='text-5xl'><EditOutlined /></div>
                    </div>
                    <div id='mission-details-box' className='bg-zinc-200 flex flex-col px-6 py-3 shadow-lg'>
                        <div id='mission-description' className=''>
                            <TextArea defaultValue={MissionInfo.MissionDescription} placeholder="Autosize height based on content lines" autoSize className='w-full text-xl text-black shadow-lg' onBlur={e => {
                                e.preventDefault();
                                const NewDescriptionPost = new URLSearchParams();
                                NewDescriptionPost.append('MissionID', MissionID);
                                NewDescriptionPost.append('MissionDescription', e.target.value);
                                client.post('http://127.0.0.1:7001/mission/editdescription/', NewDescriptionPost).then(function(response) {
                                    console.log(response);
                                });
                            }}/>
                        </div>
                        <div id='mission-status' className='flex flex-row justify-center items-center'>
                            <div className='text-3xl shadow-lg' onClick={
                                e => {
                                    e.preventDefault();
                                    const NewStatusPost = new URLSearchParams();
                                    NewStatusPost.append('MissionID', MissionID);
                                    NewStatusPost.append('MissionStatus', MissionInfo.MissionStatus === '未完成' ? '已完成' : '未完成');
                                    client.post('http://127.0.0.1:7001/mission/editstatus/', NewStatusPost).then(function(response) {
                                        console.log(response);
                                        window.location.reload();
                                    });
                            }}><Button>{MissionInfo.MissionStatus}</Button></div>
                        </div>
                        <div id='mission-files' className='mt-2'><FileUpload multiple /></div>
                        <div id='mission-comments' className='flex flex-col'>
                            <div id='comment-input-box' className='flex flex-col text-black'>
                                <div className='text-xl'>评论区</div>
                                <div className='flex flex-row'>
                                    <div className='grow'><TextArea placeholder="Autosize height based on content lines" autoSize className='shadow-lg' onBlur={e => {
                                        UnpublishedComment = e.target.value;
                                    }}/></div>
                                    <div className='shadow-lg'><Button type="primary" className='shadow-lg' onClick={handleAddComment}>发布</Button></div>
                                </div>
                            </div>
                            <div id='comment-content-box'>
                                {commentList.map((Comment, index) => (
                                        <div key={index} id={Comment.CommentID} className='mt-2 flex flex-col justify-between shadow-lg rounded-lg text-black bg-white'>
                                            <div className='text-xl'>{Comment.Commenter}</div>
                                            <div className='text-xl'>{Comment.Content}</div>
                                            <div className='text-xs'>{Comment.Date}</div>
                                        </div>
                                ))}
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
                <div id="center" className="w-2/5 h-screen bg-zinc-300 border-r-zinc-600 border">
                    <div className="flex-col justify-start text-white font-semibold">
                        <div id="project-info-box" className="bg-zinc-500 flex flex-row items-center justify-between left-1/5 top-0 py-6 px-6 shadow-lg">
                            <div><p id="project-name" className="text-5xl">{ProjectName}</p></div>
                            <div onClick={handleEditProjectName} className='text-5xl'><EditOutlined /></div>
                        </div>
                    </div>
                </div>
                <div id="right" className="w-2/5 h-screen bg-zinc-200 border-solid"><Right /></div>
            </div>
        </>
    );
}
