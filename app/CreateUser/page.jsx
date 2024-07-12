import React from 'react'
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import UserForm from '../(components)/UserForm'

const CreateUser = () => {
  return (
    <div>
      <UserForm />
    </div>
  )
}

export default CreateUser