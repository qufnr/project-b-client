import { Client, type IFrame, type IMessage } from '@stomp/stompjs'
import { ref, type Ref } from 'vue'

const reconnectDelay = import.meta.env.VITE_APP_SERVER_STOMP_RECONNECT_DELAY

export function useStomp<T>() {
    const client = ref<Client | null>(null)
    const isConnected = ref<boolean>(false)
    const messages: Ref<T[]> = ref([])

    /**
     * 연결
     *
     * @param url 브로커 URL
     * @param headers 해더 내용
     */
    function connect(url: string, headers: Record<string, string> = {}) {
        client.value = new Client({
            brokerURL: url,
            connectHeaders: headers,
            debug: (msg: string) => {
                console.log(`[STOMP] ${msg}`)
            },
            reconnectDelay,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        })

        client.value.onConnect = (frame: IFrame) => {
            isConnected.value = true
            console.log(`[STOMP] Connected!`, frame)
        }

        client.value.onStompError = (frame: IFrame) => {
            console.error(`[STOMP] Broker reported error: ${frame.headers['message']}`)
            console.error(`[STOMP] Additional details: ${frame.body}`)
        }

        client.value.activate()
    }

    /**
     * 메시지 구독
     *
     * @param destination 구독 경로
     * @param callback 구독 성공 콜백
     */
    function subscribe(destination: string, callback?: (body: T) => void) {
        if(!client.value || !client.value.connected)
            throw Error('STOMP Client is not connected.')

        client.value.subscribe(destination, (message: IMessage) => {
            try {
                const parsedBody: T = JSON.parse(message.body)
                messages.value.push(parsedBody)
                if(callback)
                    callback(parsedBody)
            }
            catch(error: any) {
                console.error('[STOMP] JSON Parse Error', error)
            }
        })
    }

    /**
     * 메시지 보내기
     *
     * @param destination 구독 경로
     * @param body 전송할 Body
     */
    function send(destination: string, body: any) {
        if(!client.value || !client.value.connected)
            return

        client.value.publish({
            destination,
            body: JSON.stringify(body)
        })
    }

    /**
     * 연결 해제
     */
    function disconnect() {
        if(!client.value)
            return

        client.value.deactivate()
        isConnected.value = false
        console.log('[STOMP] Disconnected.')
    }

    return {
        client,
        isConnected,
        messages,
        connect,
        subscribe,
        send,
        disconnect
    }
}
