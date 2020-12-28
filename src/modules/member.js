const memberStore = {
    namespaced: true,
    state : {
        login_info : {
            number:0,
        }
    },
    getters: { 
        GET_LOGIN_INFO: state => state.login_info
    },
    mutations: {
        MU_LOGIN_INFO  : (state, info) => {
            state.login_info = info
        }
    },
    actions:{
        AC_LOGIN_INFO : ({commit}, info) => {
            commit('GET_LOGIN_INFO', info)
        }
    }
}

export default memberStore;