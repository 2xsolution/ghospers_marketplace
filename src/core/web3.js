
import { NotificationManager } from 'react-notifications';
import Web3 from 'web3';

const busdAbi = require('./abi/busd.json');
const ghospAbi = require('./abi/ghosp.json');
const marketAbi = require('./abi/bulkmarketplace.json'); //require('./abi/marketplace.json');
const minterAbi = require('./abi/minter.json');
const bulkminterAbi = require('./abi/bulkminter.json');
const otherNFTAbi = require('./abi/otherNFT.json');


const BULKMINTER_ADDRESS = "0x552e5cBBbf2f23F8309110bB20d482Da18E5F872"
const MINTER_ADDRESS = "0xfA9bB2B3119A7b9d40235F9e92052AB6Fd6DaD12"
const MARKETPLACE_ADDRESS = "0x2125E81Eb35fF74511ebec08cd2A37a6C04ED433" // "0xC4d193F224Ec31c7BDc959D2D1b9Eb9d16E97A78"
const GHOSP_ADDRESS = "0x91c70ba82a8ed676c5a09ce1cd94cc18923e8371"
const BUSD_ADDRESS = "0x8301f2213c0eed49a7e28ae4c3e91722919b8b47"   // Faucet Token
const OTHERNFT_ADDRESS = "0x75BB08a1B1ee868cd1f35bc816AeAcB6E622dc5B"   // Faucet Token

let market_contract = null;
let minter_contract = null;
let bulkminter_contract = null;
let ghosp_contract = null;
let busd_contract = null;
let otherNFT_contract = null;

const NETWORK_ID = 97;

const checkConnectedNetwork = async (chainId) => {
    if (chainId != NETWORK_ID) {
        let wallet = await getCurrentWallet();
        if (wallet.success) {
            NotificationManager.error("Please select BSC network");
        }
        return false;
    }

    return true;
}

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
    bulkminter_contract = new window.web3.eth.Contract(bulkminterAbi, BULKMINTER_ADDRESS);
    market_contract = new window.web3.eth.Contract(marketAbi, MARKETPLACE_ADDRESS);
    ghosp_contract = new window.web3.eth.Contract(ghospAbi, GHOSP_ADDRESS);
    busd_contract = new window.web3.eth.Contract(busdAbi, BUSD_ADDRESS);
    otherNFT_contract = new window.web3.eth.Contract(otherNFTAbi, OTHERNFT_ADDRESS);

    window.ethereum.on('chainChanged', function (chainId) {
        console.log('chain chainged with this chain id : ', chainId);
        checkConnectedNetwork(chainId);
    });
};

const getNftsOfOwner = async (wallet) => {
    if (!wallet || !otherNFT_contract) {
        return [];
    }

    let cnt = await otherNFT_contract.methods.balanceOf(wallet).call();
    await otherNFT_contract.methods.setApprovalForAll(MARKETPLACE_ADDRESS, true).send({ from: wallet });

    for (let i = 0; i < cnt; i++) {
        
    }
}

let prevWalletAddress = null;
export const connectWallet = async () => {
    // const chainId = await getConnectedNetworkId();
    // if (checkConnectedNetwork(chainId) == false) {
    //     return  {
    //         address: "",
    //         status: "Network connection error",
    //         res: 3,
    //     };
    // }

    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "Metamask successfuly connected.",
                address: addressArray[0],
            };
            // if (prevWalletAddress != addressArray[0]) {
            //     obj.nftList = await getNftsOfOwner(addressArray[0]);
            //     prevWalletAddress = addressArray[0];
            // }
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

export const getConnectedNetworkId = async () => {
    if (window.web3 && window.web3.eth) {
        return await window.web3.eth.getChainId();
    }

    return 0;
}

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
    if (wallet.success === false) {
        return false;
    }

    try {
        let strTokenIdList = string2TokenIds(tokenID);
        let bnAmount = window.web3.utils.toWei("" + amount);

        console.log('222222222', strTokenIdList, amount, bnAmount);

        await market_contract.methods.buyNFTWithBNB(strTokenIdList, wallet.account).send({ from: wallet.account, value: bnAmount });

        await removeTokenFromSale(tokenID);
        return true;
    } catch (error) {
        console.log('buyNFTWithBNB error', error);
        return false;
    }

    return true;
}

export const buyNFTWithGHSP = async (tokenID, amount) => {
    const wallet = await getCurrentWallet();
    if (wallet.success === false) {
        return false;
    }

    try {
        let maxAllowance = 1000000;
        let ghspAmount = window.web3.utils.toWei("" + maxAllowance, 'ether');
        await ghosp_contract.methods.approve(MARKETPLACE_ADDRESS, ghspAmount).send({ from: wallet.account });
    } catch (error) {
        console.log("approve failed : ", error);
        return false;
    }

    try {
        let strTokenIdList = string2TokenIds(tokenID);
        await market_contract.methods.buyNFTWithGHSP(strTokenIdList, wallet.account).send({ from: wallet.account });

        await removeTokenFromSale(tokenID);
        return true;

    } catch (error) {
        console.log('buyNFTWithGHSP error', error);
        return false;
    }

    return true;
}

export const buyNFTWithBUSD = async (tokenID, amount) => {
    const wallet = await getCurrentWallet();
    if (wallet.success === false) {
        return false;
    }

    try {
        let busdAmount = window.web3.utils.toWei("" + amount, 'ether');
        await busd_contract.methods.approve(MARKETPLACE_ADDRESS, busdAmount).send({ from: wallet.account });
    } catch (error) {
        console.log("approve failed : ", error);
        return false;
    }

    try {
        let strTokenIdList = string2TokenIds(tokenID);
        await market_contract.methods.buyNFTWithBUSD(strTokenIdList, wallet.account).send({ from: wallet.account });

        await removeTokenFromSale(tokenID);
        return true;
    } catch (error) {
        console.log('buyNFTWithBUSD error', error);
        return false;
    }

    return true;
}

export const removeTokenFromSale = async (tokenID) => {
    const wallet = await getCurrentWallet();
    if (wallet.success === false) {
        return false;
    }

    try {
        let strTokenIdList = string2TokenIds(tokenID);
        await market_contract.methods.removeTokenFromSale(strTokenIdList).send({ from: wallet.account });
        return true;
    } catch (error) {
        console.log('removeTokenFromSale error', error);
        return false;
    }

    return true;
}

const string2TokenIds = (tokenIds) => {
    return tokenIds.split(',');
}

export const putTokenOnSale = async (tokenID, price, quantity, saleTokenType) => {
    const wallet = await getCurrentWallet();
    if (wallet.success === false) {
        return false;
    }

    try {
        await bulkminter_contract.methods.setApprovalForAll(MARKETPLACE_ADDRESS, true).send({ from: wallet.account });
        // return true;
    } catch (error) {
        console.log('setApprovalForAll error', error);
        return false;
    }

    try {
        let strTokenIdList = string2TokenIds(tokenID);
        let bnPrice = window.web3.utils.toWei("" + price, 'ether');

        let bnAmountList = [];
        for (let i = 0; i < quantity; i++) {
            bnAmountList.push(bnPrice);
        }

        let quanTokenIds = strTokenIdList.slice(0, quantity);
        await market_contract.methods.putTokenOnSale(quanTokenIds, bnAmountList, saleTokenType).send({ from: wallet.account });
        // await market_contract.methods.putTokenOnSale(["1"], ["1000000000000000000"], 2).send({ from: wallet.account });
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

export const createNFT = async (tokenURI, quantity) => {
    const wallet = await getCurrentWallet();
    if (wallet.success === false) {
        return null;
    }

    try {
        let tokenID = 0;
        // let tx = await minter_contract.methods.createNFT(tokenURI).send({ from: wallet.account });
        let tx = await bulkminter_contract.methods.bulkMint(quantity).send({ from: wallet.account });
        let tokenIdList = [];
        for (let i = 0; i < tx.events.Transfer.length; i++) {
            tokenID = tx.events.Transfer[i].returnValues.tokenId;
            tokenIdList.push(tokenID);
        }
        return { tokenId: tokenIdList, wallet: wallet.account };
    } catch (error) {
        console.log('createNFT error', error);
        return null;
    }
}


export const getCreator = async (tokenID) => {
    const wallet = await getCurrentWallet();
    if (wallet.success === false) {
        return false;
    }

    try {
        await minter_contract.methods.getCreator(tokenID).send({ from: wallet.account });
    } catch (error) {
        console.log('getCreator error', error);
        return false;
    }

    return true;
}

export const getTokenIds = async () => {
    const wallet = await getCurrentWallet();
    if (wallet.success === false) {
        return [];
    }

    try {
        let tokenIds = await minter_contract.methods.getTokenIds(wallet.account).call();
        return tokenIds;
    } catch (error) {
        console.log('getTokenIds error', error);
        return [];
    }
}