import React, { Component } from "react";
import Crud from "./contracts/crud.json";
import Web3 from "web3";

import "./App.css";

class App extends Component {
  componentDidMount = async() => {
    await this.loadWeb3();
    await this.loadBlockchainData();
  } 

  async loadWeb3() {
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('We b3 browser not detected. Try using Metamask');
    }
  }
  async loadBlockchainData() {
    let web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0])
    this.setState({account:accounts[0]});
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = Crud.networks[networkId];
    const crudInstance = new web3.eth.Contract(
      Crud.abi, 
      deployedNetwork && deployedNetwork.address
      );
    this.setState({crudInstance: crudInstance});
  }
  constructor(props){
    super(props);
    this.state = {
      account: '',
      crudInstance : null,
      updatedText:'',
      updatedReadText: '',
      updatedEditText:'',
      updatedDeleteText:'',
    }
    // this.handleCreate = this.handleCreate.bind(this);
    // this.handleRead = this.handleRead.bind(this);
    // this.handleEdit = this.handleEdit.bind(this);
    // this.handleDelete = this.handleDelete.bind(this);
  }

  async handleCreate(usersName){
    await this.state.crudInstance.methods.create(usersName).send({from:this.state.account});
    var nextId = await this.state.crudInstance.methods.nextId.call().call();
    this.setState({updatedText:`New user ${usersName} has been created with Id ${nextId-1}`});
  }

  async handleRead(readId){
    try{
      var readData= await this.state.crudInstance.methods.read(readId).call();
      console.log(readData)
      this.setState({updatedReadText:`The User at ${readId} is ${readData[1]}`});
    }catch(e){
      this.setState({updatedReadText:"User does not exist"});
    }
  }

  async handleEdit(editId, editName){
    try{
     await this.state.crudInstance.methods.update(editId, editName).send({from: this.state.account});
      this.setState({updatedEditText:`The User at ${editId} is updated to ${editName}`});
    }catch(e){
      this.setState({updatedEditText:"User does not exist"})
    }
  }
  
  async handleDelete(deleteId){
    try{
    await this.state.crudInstance.methods.deletE(deleteId).send({from: this.state.account});
    this.setState({updatedDeleteText:`The User at ${deleteId} is removed`});
    } catch(e){
      this.setState({updatedDeleteText:"User does not exist"})
    }
  }

  render() {
    return (
     <div>
       <nav className ="navbar navbar-dark bg-primary fixed-top flex-nowrap">
        <a
        className ="navbar-brand"
        href="https://github.com/Aysha-Hussaini/crud_smartcontract">
          Create Read Update Delete Dapp
        </a>
       </nav>
       <div className="container mt-5 mr-5 ml-5">
         <div >
            <main >
              <div className="mr-auto ml-auto">
                <h1 className="text-center pt-4 pb-4">CRUD Application </h1>
                <img src= {require('./crud.jpeg')} alt="logo" className="img-fluid mx-auto d-block pb-4" width="200" height="100" />
              </div>
              <div className="row">
                <div className="col-sm-6 ">
                  <div className="card ">
                    <div className="card-body">
                      <h5 className="card-title">
                        Create a User
                      </h5>
                      <form 
                      onSubmit={(event) => {
                        event.preventDefault();
                        const usersName= this.usersName.value;
                        this.handleCreate(usersName);
                        }}>
                        <div className="form-group" >
                          <input
                            id = "usersName"
                            className="form-control"
                            type="text"
                            ref={(input) => {this.usersName = input}}
                            placeholder="Enter name of the user"
                            //onChange={(e) => this.setState({submittedUser: e.target.value})}
                            required/>
                            <div className="pb-2"/>
                            <button type="submit" className= "btn btn-primary" >
                              Submit
                            </button>
                            <div className="mt-2"/>
                            <p className="text-weight-light"> 
                              {this.state.updatedText}
                            </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Enter Id to Read the user name
                      </h5>
                      <form onSubmit={(event) => {
                        event.preventDefault();
                        const readId = this.readId.value; 
                        this.handleRead(readId);
                        }}>
                        <div className="form-group">
                          <input
                            id = "readId"
                            className="form-control"  
                            type="text"
                            ref={(input) => {this.readId = input}}
                            placeholder="Enter Id"
                            //onChange={(e) => this.setState({submittedId: e.target.value})}
                            required/>
                            <div className="pb-2"/>
                            <button type="submit" className= "btn btn-primary">Submit</button>
                            <div className="mt-2"/>
                            <p className="text-weight-light"> 
                              {this.state.updatedReadText} 
                            </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4"/>
              <div className="row">
                <div className="col-sm-6 ">
                  <div className="card ">
                    <div className="card-body">
                      <h5 className="card-title">
                        Update the User's Name
                      </h5>
                      <form onSubmit={(event) => {
                        event.preventDefault();
                        const editId=this.editId.value;
                        const editName=this.editName.value;
                        this.handleEdit(editId, editName);
                        }}>
                        <div className="form-group">
                          <input
                            id = "editId"
                            className="form-control"
                            type="text"
                            ref={(input) => {this.editId = input}}
                            placeholder="Enter Id of the user to edit"
                            required/>
                            <div className="mt-2"/>
                          <input
                            id = "editName"
                            className="form-control"
                            type="text"
                            ref={(input) => {this.editName = input}}
                            placeholder="Enter the name to update"
                            required/>  
                            <div className="pb-2"/>
                            <button type="submit" className= "btn btn-primary">Submit</button>
                            <div className="mt-2"/>
                            <p className="text-weight-light"> 
                            {this.state.updatedEditText} 
                            </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        Enter Id to Delete the user
                      </h5>
                      <form onSubmit={(event) => {
                        event.preventDefault();
                        const deleteId=this.deleteId.value;
                        this.handleDelete(deleteId);
                        }}>
                        <div className="form-group">
                          <input
                            id = "deleteId"
                            className="form-control"
                            type="text"
                            ref={(input) => {this.deleteId = input}}
                            placeholder="Enter Id"
                            required/>
                            <div className="pb-2"/>
                            <button type="submit" className= "btn btn-primary">Submit</button>
                            <div className="mt-2"/>
                            <p className="text-weight-light"> 
                            {this.state.updatedDeleteText} 
                            </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
              </div>
            </main>
         </div>
       </div>
    </div> 
     
    );
  }
}

export default App;
