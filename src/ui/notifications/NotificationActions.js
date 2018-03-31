
export function raiseNotification(notification) {
  return {
    type: "RAISE_NOTIFICATION",
    message: notification
  }
}

export function clearNotifications(){
    return {
        type: "CLEAR_NOTIFICATIONS",
        data: null
    }
}
