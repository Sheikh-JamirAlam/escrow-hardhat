// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract History {
    enum Status {
        Approved,
        Pending
    }
    struct escrow {
        uint id;
        address contractAddress;
        address depositor;
        address beneficiary;
        address arbiter;
        uint value;
        Status status;
    }

    uint internal id = 0;
    mapping(address => escrow[]) public escrowHistory;

    event EscrowAdded(address depositor, address beneficiary, uint balance);

    function newEscrow(
        address _contract,
        address _depositor,
        address _beneficiary,
        address _arbiter,
        uint _value
    ) external {
        require(
            msg.sender == _contract,
            "Request must be sent from the contract"
        );
        escrow memory myEscrow = escrow({
            id: id,
            contractAddress: _contract,
            depositor: _depositor,
            beneficiary: _beneficiary,
            arbiter: _arbiter,
            value: _value,
            status: Status.Pending
        });
        escrowHistory[_depositor].push(myEscrow);
        id = id + 1;
        emit EscrowAdded(_depositor, _beneficiary, _value);
    }

    function approveEscrow(
        address _contract,
        address _depositor,
        uint _id
    ) external {
        require(
            msg.sender == _contract,
            "Request must be sent from the contract"
        );

        for (uint i = 0; i < escrowHistory[_depositor].length; i++) {
            if (escrowHistory[_depositor][i].id == _id) {
                escrowHistory[_depositor][i].status = Status.Approved;
            }
        }
    }

    function viewEscrow(address _user) external view returns (escrow[] memory) {
        return escrowHistory[_user];
    }
}
