import { Client, type IFrame, type IMessage } from '@stomp/stompjs'
import { useCookies } from '@vueuse/integrations/useCookies'
import { cookieNames } from '@/construct.ts'
import { ref, type Ref } from 'vue'

const wsUrl = import.meta.env.VITE_APP_SERVER_WS_URL
const reconnectDelay = import.meta.env.VITE_APP_SERVER_WS_RECONNECT_DELAY

interface StompOptions {
    brokerUrl?: string
    authenticated?: boolean
    headers?: Record<string, string>
}

export function useStomp<T>() {
    const client = ref<Client | null>(null)
    const isConnected = ref<boolean>(false)
    const messages: Ref<T[]> = ref([])

    /**
     * 연결
     *
     * @param options 옵션
     */
    function connect(options?: StompOptions) {
        const defaultOptions = { brokerUrl: wsUrl, authenticated: false, headers: {} }
        options = options == null ? defaultOptions : { ...defaultOptions, ...options }

        //  authenticated가 true일 경우 사용자 JWT 긁어와서 StompClient에 뿌리기
        if(options.authenticated) {
            const cookies = useCookies([cookieNames.token.access])
            options.headers!['Authorization'] = `Bearer ${cookies.get(cookieNames.token.access)}`
        }

        client.value = new Client({
            brokerURL: options.brokerUrl,
            connectHeaders: options.headers,
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
