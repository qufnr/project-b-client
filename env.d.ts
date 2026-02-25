interface ImportMetaEnv {
    readonly VITE_APP_NAME: string
    readonly VITE_APP_SERVER_URL: string
    readonly VITE_APP_SERVER_CONNECT_TIMEOUT: number
    readonly VITE_APP_SERVER_STATIC_URL: string
    readonly VITE_APP_SERVER_STOMP_RECONNECT_DELAY: number
    readonly VITE_UPLOAD_IMAGE_EXTENSION_SHORT: string
    readonly VITE_UPLOAD_IMAGE_EXTENSION: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
