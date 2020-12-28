const mediaStore = {
    namespaced: true,
    state : {
        NV : 0,
        EX : {
            key : 'pop',
            btn : 0,
        },
        SC : {
            sc:0,
            ch:0,
        },
        KEYWORD : null,
        OPEN_EMAIL : null,
    },
    getters: { 
        GET_NV: state => state.NV,
        GET_EX : state => state.EX,
        GET_SC : state => state.SC,
        GET_KEYWORD : state => state.KEYWORD,
        GET_OPEN_EMAIL : state => state.OPEN_EMAIL,
    },
    mutations: {
        MU_NV  : (state, NV) => {
            state.NV = NV;
        },
        MU_EX_KEY  : (state, KEY) => {
            state.EX.key = KEY;
        },
        MU_EX_BTN : (state, BTN) => {
            state.EX.btn = BTN;
        },
        MU_SC_SC : (state, SC) =>{
            state.SC.sc = SC;
        },
        MU_SC_CH : (state, CH) =>{
            state.SC.ch = CH;
        },
        MU_KEYWORD: (state, KEYWORD) => {
            state.KEYWORD = KEYWORD;
        },
        MU_OPEN_EMAIL: (state, EMAiL) => {
            state.OPEN_EMAIL = EMAiL;
        }

    },
}

export default mediaStore;