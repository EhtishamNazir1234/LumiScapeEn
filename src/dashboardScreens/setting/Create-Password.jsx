import React, { useState } from 'react'
import InputField from '../../common/InputField'

const CreatePassword = () => {
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  return (
    <div className="global-bg-color lg:w-[65%] h-auto rounded-[20px] md:p-10 p-5 box-shadow">
      <h1 className="text-[20px] font-[500] font-vivita">Create New Password</h1>
      <div className="my-[3rem]">
        <InputField
          id="password"
          label="New Password"
          type="password"
          placeholder=""
          rounded
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          color="#0060A9"
        />
        <InputField
          id="rePassword"
          label="Re-Enter Password"
          type="password"
          placeholder=""
          rounded
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          color="#0060A9"
        />
      </div>
      <div className="flex justify-end mt-[4rem]">
        <button className="custom-shadow-button font-vivita  !py-3">
          Update Password
        </button>
      </div>
    </div>
  )
}

export default CreatePassword