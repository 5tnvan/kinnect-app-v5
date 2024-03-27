// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class PaymentChange extends ethereum.Event {
  get params(): PaymentChange__Params {
    return new PaymentChange__Params(this);
  }
}

export class PaymentChange__Params {
  _event: PaymentChange;

  constructor(event: PaymentChange) {
    this._event = event;
  }

  get sender(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get receiver(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get newMessage(): string {
    return this._event.parameters[2].value.toString();
  }

  get value(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get fee(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class contractsepolia extends ethereum.SmartContract {
  static bind(address: Address): contractsepolia {
    return new contractsepolia("contractsepolia", address);
  }

  amountsReceived(param0: Address): BigInt {
    let result = super.call(
      "amountsReceived",
      "amountsReceived(address):(uint256)",
      [ethereum.Value.fromAddress(param0)],
    );

    return result[0].toBigInt();
  }

  try_amountsReceived(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "amountsReceived",
      "amountsReceived(address):(uint256)",
      [ethereum.Value.fromAddress(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  message(): string {
    let result = super.call("message", "message():(string)", []);

    return result[0].toString();
  }

  try_message(): ethereum.CallResult<string> {
    let result = super.tryCall("message", "message():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class SaveSwitchCall extends ethereum.Call {
  get inputs(): SaveSwitchCall__Inputs {
    return new SaveSwitchCall__Inputs(this);
  }

  get outputs(): SaveSwitchCall__Outputs {
    return new SaveSwitchCall__Outputs(this);
  }
}

export class SaveSwitchCall__Inputs {
  _call: SaveSwitchCall;

  constructor(call: SaveSwitchCall) {
    this._call = call;
  }
}

export class SaveSwitchCall__Outputs {
  _call: SaveSwitchCall;

  constructor(call: SaveSwitchCall) {
    this._call = call;
  }
}

export class SetPaymentCall extends ethereum.Call {
  get inputs(): SetPaymentCall__Inputs {
    return new SetPaymentCall__Inputs(this);
  }

  get outputs(): SetPaymentCall__Outputs {
    return new SetPaymentCall__Outputs(this);
  }
}

export class SetPaymentCall__Inputs {
  _call: SetPaymentCall;

  constructor(call: SetPaymentCall) {
    this._call = call;
  }

  get _receiver(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _message(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class SetPaymentCall__Outputs {
  _call: SetPaymentCall;

  constructor(call: SetPaymentCall) {
    this._call = call;
  }
}

export class WithdrawCall extends ethereum.Call {
  get inputs(): WithdrawCall__Inputs {
    return new WithdrawCall__Inputs(this);
  }

  get outputs(): WithdrawCall__Outputs {
    return new WithdrawCall__Outputs(this);
  }
}

export class WithdrawCall__Inputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}

export class WithdrawCall__Outputs {
  _call: WithdrawCall;

  constructor(call: WithdrawCall) {
    this._call = call;
  }
}
