export const LiquidInfrastructure = { FEE_PERCENTAGE: 0.06, calculateNet: (gross) => { const fee = gross * 0.06; return { gross, fee: fee.toFixed(2), net: (gross - fee).toFixed(2) }; } };
