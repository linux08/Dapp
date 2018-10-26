pragma solidity ^0.4.0;

contract SaveFile {
    string ipfsHash;
    // string name ;
 
    function sendHash(string x) public {
        ipfsHash = x;
    }

    function getHash() public view returns (string x) {
        return ipfsHash;
    }
}