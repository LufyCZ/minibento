import { Address, log } from "@graphprotocol/graph-ts";
import {
  LogDeposit,
  LogWithdraw,
  LogFlashLoan,
  LogStrategyProfit,
  LogStrategyLoss,
} from "../generated/BentoBox/BentoBox";
import { Token } from "../generated/schema";
import { BIG_INT_ZERO } from "./constants";

export function getToken(address: Address): Token {
  let token = Token.load(address.toHex());

  if (token === null) {
    token = new Token(address.toHex());

    token.totalSupplyBase = BIG_INT_ZERO;
    token.totalSupplyElastic = BIG_INT_ZERO;

    token.save();
  }

  return token as Token;
}

export function handleLogDeposit(event: LogDeposit): void {
  const token = getToken(event.params.token);
  token.totalSupplyBase = token.totalSupplyBase.plus(event.params.share);
  token.totalSupplyElastic = token.totalSupplyElastic.plus(event.params.amount);
  token.save();
}

export function handleLogWithdraw(event: LogWithdraw): void {
  const token = getToken(event.params.token);
  token.totalSupplyBase = token.totalSupplyBase.minus(event.params.share);
  token.totalSupplyElastic = token.totalSupplyElastic.minus(
    event.params.amount
  );
  token.save();
}

export function handleLogStrategyProfit(event: LogStrategyProfit): void {
  const token = getToken(event.params.token);
  token.totalSupplyElastic = token.totalSupplyElastic.plus(event.params.amount);
  token.save();
}

export function handleLogStrategyLoss(event: LogStrategyLoss): void {
  const token = getToken(event.params.token);
  token.totalSupplyElastic = token.totalSupplyElastic.minus(
    event.params.amount
  );
  token.save();
}

export function handleLogFlashLoan(event: LogFlashLoan): void {
  const token = getToken(event.params.token);
  token.totalSupplyElastic = token.totalSupplyElastic.plus(
    event.params.feeAmount
  );
  token.save();
}
