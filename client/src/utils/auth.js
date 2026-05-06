export const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const getEmail = () => localStorage.getItem('email')

export const getUserType = () => localStorage.getItem('userType')

export const getToken = () => localStorage.getItem('token')

export const isLoggedIn = () => !!localStorage.getItem('token')

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('email')
  localStorage.removeItem('userType')
}