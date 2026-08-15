const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <div
      className={
        notification.type === 'success'
          ? 'success'
          : 'error'
      }
    >
      {notification.message}
    </div>
  )
}

export default Notification