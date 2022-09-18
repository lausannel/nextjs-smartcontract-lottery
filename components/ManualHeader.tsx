import { useMoralis } from "react-moralis";
import { useEffect } from "react";

// 手动实现的Header组件
function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis(); //acount是一个string，显示目前的账户地址
    console.log("Rerendered!");
    // some button that connects us and changes connected to be true，此时需要rerender，如果是变量不会rerender，但是state和hook会rerender
    useEffect(() => {
        if (isWeb3Enabled) return;
        if (window.localStorage.getItem("connected")) {
            console.log(`isWeb3EnabledUseEffect: ${isWeb3Enabled}`);
            enableWeb3(); // 如果有了这个键值对，说明上次已经连接过了，那么我们用enableWeb3()来更新isWeb3Enabled的状态，从而触发rerender
        }
    }, [isWeb3Enabled]); // 一直检查[]中的变量，如果变量变化了，就会调用第一个参数的函数，并且rerender整个页面
    // useEffect会在页面Load时自动运行 ，
    // 如果不给参数，任何变量变化都会rerender，要小心这一点，因为可能产生循环render，例如在useEffect中更改某些函数
    // 如果给出一个空的[]，那么只会在页面Load时运行一次
    // 想要每次刷新页面的时候都会自动记住我们已经enable了Web3，需要用到LocalStorage

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`);
            if (account == null) {
                // 如果目前没有账户
                window.localStorage.removeItem("connected");
                deactivateWeb3(); // set isWeb3Enabled to false
                console.log("Null account found");
            }
        });
        if (account == null) {
            console.log("There is no one connected to the website");
            window.localStorage.removeItem("connected");
            deactivateWeb3();
        }
    }, []);

    return (
        <div>
            {account ? ( // 如果账户地址为空，显示connect按钮来连接，否则显示账户地址
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3(); // enableWeb3一行代码连接钱包，不过目前只支持MetaMask
                        // 存储一些信息到LocalStorage，这样每次刷新页面的时候都会自动记住我们已经enable了Web3
                        window.localStorage.setItem("connected", "injected"); // 在这个窗口中存储一个键值对
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    );
}

// Hard Way first then Easy Way
// Learn how to calculate a derivative
// learn the shortcut

export default ManualHeader;
