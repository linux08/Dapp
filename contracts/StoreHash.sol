pragma solidity ^0.4.0;

contract SaveFile {
   
    // string name ;
    struct file{
        string name;
        string ipfsHash;
    }
    file[] public files; 
    uint256 public totalFile;

    event FileEvent(string name , string ipfsHash);

    constructor() public {
        totalFile = 0;
    }

    function insertFile(string ipfsHash, string name) public returns (uint256 total){ 
        // ipfsHash = x;
        file memory newFile = file(ipfsHash , name);
        files.push(newFile);
        totalFile++;
        //emit event
        emit FileEvent (ipfsHash, name);
        return total;
    }

    function getFile(string fileName) public view returns (string ipfsHash, string name) {
              for(uint256 i = 0;i<totalFile; i++){
              return (files[i].name ,files[i].ipfsHash);
        }
        revert("file not found");
    }
      
    // }
}