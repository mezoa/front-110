import { useState } from 'react'
import axios from 'axios'

const useRegisterForm = (initialState) => {
  const [values, setValues] = useState(initialState)

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://expenseapp.test/api/register', values)
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return { values, handleChange, handleSubmit }
}

export default useRegisterForm