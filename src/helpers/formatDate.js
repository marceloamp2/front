const formatDate = (dateString) => {
  if (!dateString) {
    return ''
  }

  const [year, month, day] = dateString.split('-').map(Number)
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
}

export default formatDate
