pragma solidity ^0.4.0;

contract SaveAddress {
    string ipfsHash;
    struct hash {
        string x;
    }
    hash[] public hashes;
    mapping (uint => hash) hashs;
 
    function saveHash(string x) public {
        ipfsHash = x;
    }
    function getHash( string y) public view returns ( string x) {
        return ipfsHash;
    }
}       