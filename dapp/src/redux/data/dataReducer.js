const initialState = {
  loading: false,
  activeRound: 0,
  cntPrice: 1,
  busdAmount: 0,
  investors: 0,
  busdAmount1: 0,
  investors1: 0,
  busdAmount2: 0,
  investors2: 0,
  busdAmount3: 0,
  investors3: 0,
  roundInfo1: null,
  roundInfo2: null,
  roundInfo3: null,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        activeRound: action.payload.activeRound,
        cntPrice: action.payload.cntPrice,
        busdAmount: action.payload.busdAmount,
        investors: action.payload.investors,
        busdAmount1: action.payload.busdAmount1,
        investors1: action.payload.investors1,
        busdAmount2: action.payload.busdAmount2,
        investors2: action.payload.investors2,
        busdAmount3: action.payload.busdAmount3,
        investors3: action.payload.investors3,
        roundInfo1: action.payload.roundInfo1,
        roundInfo2: action.payload.roundInfo2,
        roundInfo3: action.payload.roundInfo3,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
