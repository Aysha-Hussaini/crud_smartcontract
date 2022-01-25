pragma solidity >=0.4.22 <0.9.0;

contract Crud {
  //state variables
  struct User{
    uint id;
    string name;
  }

  User[] public users;
  uint public nextId =1;

  //create function
  function create(string memory name)public {
    users.push(User(nextId, name));
    nextId++;
  }

  //read function
  function read(uint id) public view returns(uint, string memory){
    uint i = find(id);
    if(users[i].id == id){
      return(users[i].id, users[i].name);
    }
  }
  

  //update function
  function update(uint id, string memory name) public {
    uint i = find(id);
    if(users[i].id == id){
      users[i].name = name;
    }
    
  }

  //delete function 
  function deletE(uint id) public {
    uint i = find(id);
    if(users[i].id == id){
      delete users[i];
    }
    
  }

  //find i 
  function find(uint id) view internal returns(uint){
    for (uint i=0; i< users.length; i++){
      if(users[i].id == id){
        return i;
      }
    }
    revert('User does not exist!');
  }
}
