
import Web3 from 'web3';

const busdAbi = require('./abi/busd.json');
const ghospAbi = require('./abi/ghosp.json');
const marketAbi = require('./abi/marketplace.json');
const minterAbi = require('./abi/minter.json');


const MINTER_ADDRESS = "0xfA9bB2B3119A7b9d40235F9e92052AB6Fd6DaD12"
const MARKETPLACE_ADDRESS = "0xC4d193F224Ec31c7BDc959D2D1b9Eb9d16E97A78"
const GHOSP_ADDRESS = "0x91c70ba82a8ed676c5a09ce1cd94cc18923e8371"
const BUSD_ADDRESS = "0x8301f2213c0eed49a7e28ae4c3e91722919b8b47"   // Faucet Token
let market_contract = null;
let minter_contract = null;
let ghosp_contract = null;
let busd_contract = null;


export const loadWeb3 = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.web3.eth.handleRevert = true;
    } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        window.web3.eth.handleRevert = true
    } else {
        window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
        return;
    }

    minter_contract = new window.web3.eth.Contract(minterAbi, MINTER_ADDRESS);
    market_contract = new window.web3.eth.Contract(marketAbi, MARKETPLACE_ADDRESS);
    ghosp_contract = new window.web3.eth.Contract(ghospAbi, GHOSP_ADDRESS);
    busd_contract = new window.web3.eth.Contract(busdAbi, BUSD_ADDRESS);

    window.ethereum.on('chainChanged', function (chainId) {

    });
};


export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "Metamask successfuly connected.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "Something went wrong: " + err.message,
            };
        }
    }
    else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual BSC wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};


export const getCurrentWallet = async () => {
    const web3 = window.web3;
    try {
        let accounts = await web3.eth.getAccounts();
        let accountBalance = await web3.eth.getBalance(accounts[0]);
        accountBalance = web3.utils.fromWei(accountBalance);
        return {
            success: true,
            account: accounts[0],
            balance: accountBalance
        }
    } catch (error) {
        return {
            success: false,
            result: "Something went wrong: " + error.message
        }
    }
}


export const buyNFTWithBNB = async (tokenID, amount) => {

    const wallet = await getCurrentWallet();
    if (wallet.success===false) {
        return false;
    }

    try {
        let bnAmount = window.web3.utils.toWei("" + amount);
        console.log('ssssssssssss', tokenID, bnAmount);
        let tx = await market_contract.methods.buyNFTWithBNB(tokenID, wallet.account).send({ from: wallet.account, value: bnAmount });
    } catch (error) {
        console.log('buyNFTWithBNB error', error);
        return false;
    }

    return true;
}

export const buyNFTWithGHSP = async (tokenID) => {
    const wallet = await getCurrentWallet();
    if (wallet.success===false) {
        return false;
    }

    try {
        let tx = await market_contract.methods.buyNFTWithGHSP(tokenID, wallet.account).send({ from: wallet.account });
    } catch (error) {
        console.log('buyNFTWithGHSP error', error);
        return false;
    }

    return true;
}

export const buyNFTWithBUSD = async (tokenID) => {
    const wallet = await getCurrentWallet();
    if (wallet.success===false) {
        return false;
    }

    try {
        let tx = await market_contract.methods.buyNFTWithBUSD(tokenID, wallet.account).send({ from: wallet.account });
    } catch (error) {
        console.log('buyNFTWithBUSD error', error);
        return false;
    }

    return true;
}

export const removeTokenFromSale = async (tokenID) => {
    const wallet = await getCurrentWallet();
    if (wallet.success===false) {
        return false;
    }

    try {
        let tx = await market_contract.methods.removeTokenFromSale(tokenID, wallet.account).send({ from: wallet.account });
    } catch (error) {
        console.log('removeTokenFromSale error', error);
        return false;
    }

    return true;
}

export const putTokenOnSale = async (tokenID, price, saleTokenType) => {
    const wallet = await getCurrentWallet();
    if (wallet.success===false) {
        return false;
    }

    try {
        await minter_contract.methods.setApprovalForAll(MARKETPLACE_ADDRESS, true).send({ from: wallet.account });
    } catch (error) {
        console.log('setApprovalForAll error', error);
        return false;
    }

    try {
        let bnPrice = window.web3.utils.toWei("" + price);
        let tx = await market_contract.methods.putTokenOnSale(tokenID, bnPrice, saleTokenType).send({ from: wallet.account });
    } catch (error) {
        console.log('putTokenOnSale error', error);
        return false;
    }

    console.log('putTokenOnSale ok');

    return true;
}

export const getSaleItems = async (tokenIds) => {

    let saleItems = {};
    for (let i = 0; i < tokenIds.length; i++) {
        let item = await market_contract.methods.saleItems(tokenIds[i]).call();
        saleItems[tokenIds[i]] = item;
    }

    console.log("Sale Items : ", saleItems);

    return saleItems;
}

export const createNFT = async (tokenURI) => {
    const wallet = await getCurrentWallet();
    if (wallet.success===false) {
        return null;
    }

    try {
        let tokenID = 0;
        let tx = await minter_contract.methods.createNFT(tokenURI).send({ from: wallet.account });
        tokenID = tx.events.Transfer.returnValues.tokenId;
        return {tokenId: tokenID, wallet: wallet.account};
    } catch (error) {
        console.log('createNFT error', error);
        return null;
    }

    return null;
}


export const getCreator = async (tokenID) => {
    const wallet = await getCurrentWallet();
    if (wallet.success===false) {
        return false;
    }

    try {
        let tx = await minter_contract.methods.getCreator(tokenID).send({ from: wallet.account });
    } catch (error) {
        console.log('getCreator error', error);
        return false;
    }

    return true;
}

export const getTokenIds = async () => {
    const wallet = await getCurrentWallet();
    if (wallet.success===false) {
        return [];
    }

    try {
        let tokenIds = await minter_contract.methods.getTokenIds(wallet.account).call();
        return tokenIds;
    } catch (error) {
        console.log('getTokenIds error', error);
        return [];
    }

    return [];
}