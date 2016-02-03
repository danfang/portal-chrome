import uuid from 'node-uuid'
import { SENDER_ID } from '../const'

export const THREAD_SELECTED = 'THREAD_SELECTED'
export const SENDING_MESSAGE = 'SENDING_MESSAGE'
export const SENT_MESSAGE = 'SENT_MESSAGE'

export function selectThread(index) {
  return { type: THREAD_SELECTED, index }
}

export function sendMessage(message) {
  let mid = uuid.v4()
  let messageBody = {
    "mid": mid,
    "status": "started",
    "at": "2015-06-09 08:00:00",
    "to": message.to,
    "body": message.body
  }
  let data = {
    "type": "messsage",
    "payload": JSON.stringify(messageBody)
  }
  return (dispatch, getState) => {
    let notificationKey = getState().devices.notificationKey
    let groupMessage = {
      messageId: uuid.v4(),
      destinationId: notificationKey,
      data: data
    }
    dispatch(sendingMessage(messageBody))
    chrome.gcm.send(groupMessage, (messageId) => {
      if (chrome.runtime.lastError) {
        throw new Error('error sending message')
        Promise.resolve()
        return
      }
      let upstreamMessage = {
        messageId: uuid.v4(),
        destinationId: SENDER_ID + "@gcm.googleapis.com",
        data: data
      }
      chrome.gcm.send(upstreamMessage, (messageId) => {
        if (chrome.runtime.lastError) {
          throw new Error('error sending message')
          Promise.resolve()
          return
        }
        dispatch(sentMessage(mid))
        Promise.resolve()
      })
    })
  }
}

function sendingMessage(message) {
  return { type: SENDING_MESSAGE, message }
}

function sentMessage(mid) {
  return { type: SENT_MESSAGE, mid }
}
