import './output.css'
import {useState} from "react";
import * as axios from "axios";
import { md5 } from 'js-md5';
import { message } from 'antd';
function SignIn()
{
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    function ToSignUp()
    {
        window.location.href="./signup";
    }
    async function ToSignIn()
    {
        if(account === "" || password === "")
        {
            messageApi.open({
                type: 'error',
                content: '账号名或密码不能为空',
              });
            return;
        }
            const client = axios.default;
            const MayUser = new URLSearchParams();
            MayUser.append('Account', account);
            MayUser.append('Password', md5(password));
            client.post('http://127.0.0.1:7001/signin/', MayUser).then(function (response) {
            console.log(response.data);
            if(response.data.success === true)
            {
                const userInfo = response.data.data;
                console.log(userInfo);
                window.location.href='./dashboard';
                window.sessionStorage.setItem('Account', userInfo.Account);
                window.sessionStorage.setItem('Password', userInfo.Password);
                window.sessionStorage.setItem('uid', userInfo.uid);
                window.sessionStorage.setItem('Name', userInfo.Name);
            }
            else
            {
                messageApi.open({
                    type: 'error',
                    content: '账号或密码错误',
                  });
                window.location.href='./signin';
            }
        })
    }
    return (
        <>
        {contextHolder}
        <div className="bg-gradient-to-b from-cyan-500 to-indigo-500 flex items-center justify-center min-h-screen">
        <div className="bg-zinc-900 bg-opacity-50 p-24 rounded-lg shadow-lg">
        <br />
        <div className="flex items-center justify-around"><div>
        <h1 className="object-top text-white text-5xl items-center justify-center">
            登录 Login
        </h1>
        </div></div>
        <br />
        <br />
        <form className='text-white text-3xl' onSubmit={e => {
        e.preventDefault();}}>
         Account:{' '}
        <input className="rounded-full text-zinc-500 focus:text-black"
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
        <input className="rounded-full text-zinc-500 focus:text-black"
          name="Password"
          type="text"
          defaultValue="密码"
          onFocus={e=>{if(e.target.value =='密码')
            {
                  e.target.value='';
                  e.target.type='password';
              }}}
            onBlur={e=>{if(e.target.value =='')
              {
                  e.target.type='text';
                  e.target.value='密码';
              }}}
          onChange={event => setPassword(event.target.value)}
        />
        <br />
        <br />
        <div className="static flex justify-between">
            <div><button className="bg-transparent hover:bg-transparent text-white font-semibold hover:text-blue-500 py-1 px-10 border border-white hover:border-blue-500 rounded-full duration-100" onClick={ToSignUp}>注 册</button></div>
            <div><button type='signin' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-10 rounded-full duration-100" onClick={ToSignIn}>登 录</button></div>
        </div>
      </form>
        </div>
        </div>
</>
    );
}
export default SignIn