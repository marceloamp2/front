import axios from 'axios'
import api from '@/settings/api.js'

const checkIfTokenIsValid = async function (token) {
  try {
    await axios.get(api.baseUrl + '/api/auth/user', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    return true
  } catch (e) {
    return false
  }
}

export default checkIfTokenIsValid
