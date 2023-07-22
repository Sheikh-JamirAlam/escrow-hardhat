// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IHistory {
    function newEscrow(
        address _contract,
        address _depositor,
        address _beneficiary,
        address _arbiter,
        uint _value
    ) external;

    function approveEscrow(
        address _contract,
        address _depositor,
        uint _id
    ) external;
}

contract Escrow {
    address public depositor;
    address payable public beneficiary;
    address public arbiter;
    bool public isApproved;
    address public historyContract;

    event Approved(uint balance);

    constructor(
        address _arbiter,
        address payable _beneficiary,
        address _historyContract
    ) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
        isApproved = false;
        historyContract = _historyContract;

        addEscrowHistory(
            address(this),
            depositor,
            beneficiary,
            arbiter,
            msg.value
        );
    }

    function approve(uint _id) external {
        require(msg.sender == arbiter);
        uint bal = address(this).balance;
        (bool success, ) = beneficiary.call{value: bal}("");
        require(success, "Failed to send ether");
        isApproved = true;
        emit Approved(bal);
        editEscrowHistory(address(this), depositor, _id);
    }

    function addEscrowHistory(
        address _contract,
        address _depositor,
        address _beneficiary,
        address _arbiter,
        uint _value
    ) public {
        IHistory(historyContract).newEscrow(
            _contract,
            _depositor,
            _beneficiary,
            _arbiter,
            _value
        );
    }

    function editEscrowHistory(
        address _contract,
        address _depositor,
        uint _id
    ) public {
        IHistory(historyContract).approveEscrow(_contract, _depositor, _id);
    }
}
