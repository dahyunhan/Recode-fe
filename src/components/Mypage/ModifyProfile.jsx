import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';

const ModifyProfile = () => {
  const { authData } = useContext(AuthContext);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  console.log(authData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      email: email,
      nickname: nickname,
    };

    await axios.put(`http://localhost:8081/v1/users/${authData.id}`, user)
      .then(res => {
        console.log(res.data);
      })
  }

  return (
    <div className="flex justify-center items-center h-screen mt-[-20rem]">
      <div className="w-full max-w-xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">기본정보 수정</h5>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">정보를 변경하면 페이지 내의 모든 컨텐츠에 반영됩니다.</label>
          <div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">이메일</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={e => setEmail(e.target.value)}
                placeholder=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="nickname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">닉네임</label>
              <input
                type="text"
                name="nickname"
                id="nickname"
                onChange={e => setNickname(e.target.value)}
                placeholder=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                취소
              </button>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                완료
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyProfile;
