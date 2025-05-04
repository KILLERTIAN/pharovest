// utils/conversion.js

export const usdToEth = (usd) => {
    const ethRate = 2410.28; // 1 ETH = 2410.28 USD
    return (usd / ethRate).toFixed(6); // Convert USD to ETH
};

export const ethToUsd = (eth) => {
    const ethRate = 2410.28; // 1 ETH = 2410.28 USD
    return (eth * ethRate).toFixed(2); // Convert ETH to USD
};
