export const cookieNames = {
    token: {
        sign: '__v1_s_t',
        access: '__v1_t',
        refresh: '__v1_r_t'
    },
}

export const storageNames = {
    signMemberAlias: 'bserver.memberAlias',
    signOutReason: 'bserver.forceSignOutReason',
}

export const allowedHeaders = {
    authorization: 'Authorization',
    signAuthorization: 'X-BServer-Sign-Authorization',
    refreshAuthorization: 'X-BServer-Refresh-Authorization'
}
