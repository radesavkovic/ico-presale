// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

const connectContract = (payload) => {
  return {
    type: "CONNECTION_CONTRACT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();

    const busdABIResponse = await fetch("/config/erc20ABI.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const busdABI = await busdABIResponse.json();

    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const CONFIG = await configResponse.json();

    Web3EthContract.setProvider(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));
    let web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545'));

    let SmartContractObj = new Web3EthContract(
      abi,
      CONFIG.CONTRACT_ADDRESS
    );

    let BUSDContractObj = new Web3EthContract(
      busdABI,
      CONFIG.BUSD_ADDRESS
    );
    dispatch(
      connectContract({
        smartContract: SmartContractObj,
        busdContract: BUSDContractObj,
      })
    );

    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      web3 = new Web3(ethereum);

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });

        if (networkId == CONFIG.NETWORK.ID) {
          SmartContractObj = new Web3EthContract(
            abi,
            CONFIG.CONTRACT_ADDRESS
          );
          BUSDContractObj = new Web3EthContract(
            busdABI,
            CONFIG.BUSD_ADDRESS
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              busdContract: BUSDContractObj,
              web3: web3,
            })
          );
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed(`Please change network to ${CONFIG.NETWORK.NAME}.`));
        }
      } catch (err) {
        // dispatch(connectFailed("Something went wrong."));
        dispatch(connectFailed("Please unlock MetaMask"));
      }
    } else {
      dispatch(connectFailed("Please install Metamask."));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
