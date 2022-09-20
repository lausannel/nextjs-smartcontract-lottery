// have a function to enter the lottery
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers, BigNumber, ContractTransaction } from "ethers";
import Moralis from "moralis";
import { assert } from "console";
import { useNotification } from "web3uikit";

interface contractAddressesInterface {
    [key: string]: string[];
}

export default function LotteryEntrance() {
    const addresses: contractAddressesInterface = contractAddresses;
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
    const chainId: string = parseInt(chainIdHex!).toString();
    const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;
    const [entranceFee, setEntranceFee] = useState("0");
    const [numPlayers, setNumPlayers] = useState("0");
    const [recentWinner, setRecentWinner] = useState("0");

    const dispatch = useNotification();
    // console.log(parseInt(chainIdHex!));
    console.log("chainId", chainId);
    // console.log("RaffleAddress", raffleAddress);
    // console.log(abi);
    // const chainIdM = Moralis.;
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    });
    const testAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    // console.assert(raffleAddress === testAddress);
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    });

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!, // specify the networkId
        functionName: "getNumberOfPlayers",
        params: {},
    });
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress!, // specify the networkId
        functionName: "getRecentWinner",
        params: {},
    });
    const handleSuccess = async (tx: ContractTransaction) => {
        await tx.wait(1);
        handleNewNotification();
        updateUI();
    };
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        });
    };

    async function updateUI() {
        console.log("Raffle address: ", raffleAddress);
        const entranceFeeFromCall = ((await getEntranceFee({})) as BigNumber).toString();
        const numPlayersFromCall = ((await getNumberOfPlayers({})) as BigNumber).toString();
        const recentWinnerFromCall = (await getRecentWinner({})) as string;

        setEntranceFee(entranceFeeFromCall);
        setNumPlayers(numPlayersFromCall);
        setRecentWinner(recentWinnerFromCall);
        // check wether the getraffle state is executed
        console.log("Entrance fee from contract: ", entranceFeeFromCall);
        console.log("Number of players from contract: ", numPlayersFromCall);
        console.log("Recent winner from contract: ", recentWinnerFromCall);
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
    return (
        <div className="p-5">
            Hi from Lottery Entrance
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: (tx) => handleSuccess(tx as ContractTransaction), // onSuccess并没有检查是否verify
                            });
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className=" animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH </div>
                    <div> Players: {numPlayers}</div>
                    <div> Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    );
}
