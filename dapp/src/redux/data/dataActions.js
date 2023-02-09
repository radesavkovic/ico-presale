// log
import store from "../store";
// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    var smartContract = store.getState().blockchain.smartContract;
    if (!smartContract)
    {
      const abiResponse = await fetch("/config/abi.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const abi = await abiResponse.json();
  
      const configResponse = await fetch("/config/config.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
  
      const CONFIG = await configResponse.json();
  
      Web3EthContract.setProvider(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
  
      smartContract = new Web3EthContract(
        abi,
        CONFIG.CONTRACT_ADDRESS
      );
    }
    if (!smartContract)
      return;
    try {
      let activeRound = await smartContract.methods.currentRound()
        .call();
      
      let roundInfo = await smartContract.methods.roundInfos(activeRound)
        .call();

      let cntPrice = roundInfo['cntPrice'];
      let busdAmount = roundInfo['busdAmount'];
      let investors = roundInfo['investors'];

///////
      let roundInfo1 = await smartContract.methods.roundInfos(1)
        .call();

      let busdAmount1 = roundInfo1['busdAmount'];
      let investors1 = roundInfo1['investors'];
///////
      let roundInfo2 = await smartContract.methods.roundInfos(2)
        .call();

      let busdAmount2 = roundInfo2['busdAmount'];
      let investors2 = roundInfo2['investors'];
///////
      let roundInfo3 = await smartContract.methods.roundInfos(3)
        .call();

      let busdAmount3 = roundInfo3['busdAmount'];
      let investors3 = roundInfo3['investors'];

      dispatch(
        fetchDataSuccess({
          activeRound,
          cntPrice,
          busdAmount,
          investors,
          busdAmount1,
          investors1,
          busdAmount2,
          investors2,
          busdAmount3,
          investors3,
          roundInfo1,
          roundInfo2,
          roundInfo3,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
