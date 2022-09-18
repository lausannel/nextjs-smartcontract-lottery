// have a function to enter the lottery
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import Moralis from "moralis";
import { assert } from "console";

interface contractAddressesInterface {
    [key: string]: string[];
}

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const addresses: contractAddressesInterface = contractAddresses;
    // console.log(parseInt(chainIdHex!));
    const chainId = parseInt(chainIdHex!).toString();
    console.log("chainId", chainId);
    const raffleAddress = chainId in contractAddresses ? addresses[chainId][0] : null;
    // console.log("RaffleAddress", raffleAddress);
    // console.log(abi);
    // const chainIdM = Moralis.;
    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "enterRaffle",
        params: {},
        // msgValue:
    });
    const testAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    // console.assert(raffleAddress === testAddress);
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: testAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    });
    const { runContractFunction: getRaffleState } = useWeb3Contract({
        abi: abi,
        contractAddress: testAddress, // specify the networkId
        functionName: "getRaffleState",
        params: {},
    });
    Moralis.EvmApi.utils.runContractFunction;
    async function updateUI() {
        console.log("Raffle address: ", raffleAddress);
        const entranceFeeFromCall = ((await getEntranceFee()) as BigNumber).toString();
        // check wether the getraffle state is executed
        console.log("Entrance fee from contract: ", entranceFeeFromCall);
        const raffleState = await getRaffleState();
        console.log("Raffle state: ", raffleState);
        // console.log(entranceFee);
        // console.log(entranceFeeFromContract);
    }
    useEffect(() => {
        console.log("isWeb3Enabled", isWeb3Enabled);
        if (isWeb3Enabled) {
            // try to read the entrance fee
            updateUI().then(() => {
                console.log("updateUI done");
            });
        }
    }, [isWeb3Enabled]);
    return <div>Hi from Lottery Entrance</div>;
}
