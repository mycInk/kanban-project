import './output.css'
import {useState} from "react";
import * as axios from "axios";
import { md5 } from 'js-md5';
import { message } from 'antd';
function SignUp()
{
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  async function ToSignUp()
  {
    if(password !== confirmPassword)
    {
      messageApi.open({
        type: 'error',
        content: '两次输入的密码不一致',
      });
      return;
    }
    if(account === "" || password === "")
    {
      messageApi.open({
        type: 'error',
        content: '账号或密码不能为空',
      });
      return;
    }
    const client = axios.default;
    const NewUser = new URLSearchParams();
    NewUser.append('uid', String(Math.floor(Math.random()*100000000)));
    NewUser.append('Account', account);
    NewUser.append('Password', md5(password));
    NewUser.append('Name', account);
    client.post('http://127.0.0.1:7001/signup/', NewUser).then(function (response) {
      console.log(response);
    });
    window.location.href='./dashboard';
  }
    return (
      <>
      {contextHolder}
        <div className="bg-gradient-to-b  from-cyan-500 to-indigo-500  flex items-center justify-center min-h-screen">
          <div className="bg-zinc-900 bg-opacity-50 p-24 rounded-lg shadow-lg">
        <br />
        <div className="flex items-center justify-around"><div>
            <h1 className="text-5xl text-white">
                注册 SignUp
            </h1>
        </div></div>
        <br />
        <br />
        <form className='text-white text-3xl' onSubmit={e=>{
          e.preventDefault();
        }}>
            Account:{' '}
        <input
          className='rounded-full text-zinc-500 focus:text-black'
          name="Account"
          type="text"
          defaultValue="账号"
          onFocus={e=>{if(e.target.value =='账号')
            {
                  e.target.value='';
              }}}
            onBlur={e=>{if(e.target.value =='')
              {
                  e.target.value='账号';
              }}}
          onChange={event => setAccount(event.target.value)}
        />
        <br />
        <br />
            Password:{' '}
        <input
          className='rounded-full text-zinc-500 focus:text-black'
          name="Password"
          type="text"
          defaultValue="密码"
          onFocus={e=>{if(e.target.value =='密码')
            {
                  e.target.value='';
              }}}
            onBlur={e=>{if(e.target.value =='')
              {
                  e.target.value='密码';
              }}}
          onChange={event => setPassword(event.target.value)}
        />
        <br />
        <br />
            ConFirm Password:{' '}
        <input
          className='rounded-full text-zinc-500 focus:text-black'
          name="ConFirm Password"
          defaultValue="确认密码"
          type="text"
          onFocus={e=>{if(e.target.value =='确认密码')
            {
                  e.target.value='';
              }}}
            onBlur={e=>{if(e.target.value =='')
              {
                  e.target.value='确认密码';
              }}}
          onChange={event => setConfirmPassword(event.target.value)}
        />
        <br />
        <br />
        <div className="flex items-center justify-around">
        <div>
            <button type="signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-14 rounded-full duration-100" onClick={ToSignUp}>注 册</button>
        </div>
        </div>
      </form>
      </div>
      </div>
      </>)
}
export default SignUp