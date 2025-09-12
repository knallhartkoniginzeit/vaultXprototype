// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AccessControl
 * @dev Only registered apps can "use" the password.
 */
contract AccessControl {
    mapping(address => bool) public hasAccess;

    event AccessGranted(address indexed app);
    event PasswordUsed(address indexed app, string service);

    // Grant access to an app
    function grantAccess(address app) external {
        hasAccess[app] = true;
        emit AccessGranted(app);
    }

    // Check if app has access
    function checkAccess(address app) external view returns (bool) {
        return hasAccess[app];
    }

    // App uses the password (simulated)
    function usePassword(string calldata service) external {
        require(hasAccess[msg.sender], "Not authorized app");
        emit PasswordUsed(msg.sender, service);
    }
}
