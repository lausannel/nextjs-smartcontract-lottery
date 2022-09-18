// 使用Web3UIKit自动实现的Header组件
import { ConnectButton } from "web3uikit";
export default function Header() {
    return (
        <div>
            Decentralized Lottery
            <ConnectButton moralisAuth={false} />
        </div>
    );
}
