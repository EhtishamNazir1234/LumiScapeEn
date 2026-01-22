import React from 'react'
import InputField from '../../common/InputField'

const CreatePassword = () => {
  return (
    <div className="global-bg-color lg:w-[65%] h-auto rounded-[20px] md:p-10 p-5 box-shadow">
      <h1 className="text-[20px] font-[500] font-vivita">Create New Password</h1>
      <div className="my-[3rem]">
        <InputField
          id="password"
          label="New Password"
          type="text"
          placeholder=""
          rounded
        />
        <InputField
          id="rePassword"
          label="Re-Enter Password"
          type="text"
          placeholder=""
          rounded
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