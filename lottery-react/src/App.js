//A nice simple react app that presents the lotter DApp
//A practice at the first attempt of creating and uploading a react
//front end to the Lottery
import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3"
import lottery from './lottery';

class App extends React.Component {
state = {
  manager: "",
  players: [],
  balance: "",
  value: "",
  message: ""
};

  async componentDidMount(){

    const manager=await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
   //const message = "this is to start";
   //Setting up the state to be used in the app
    this.setState({manager,players, balance});
  }
  //Here is where the transaction is submitted fired by clicking the 
  //submit button
      onSubmit = async (event) => {
      event.preventDefault();
      const accounts=await web3.eth.getAccounts();

      this.setState({message: 'Waiting for completion of successful transaction...'});
     //Call the enter function on the contract with the amount entered in text box
     //from current address
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether")
      });
      console.log(this.state.message);
     
        this.setState({message: 'Congratulations you have been entered...'});
    };
    //This is triggered by the clicking of the pick a winner button
    onClick = async ()=> {

      const accounts=await web3.eth.getAccounts();
      if (accounts[0]!==this.state.manager) {
        this.setState({message: 'Sorry only the manager can pick a winner...'});
      }else{
        this.setState({message: 'Waiting for completion of successful transaction...'});
        await lottery.methods.pickWinner().send({
        from: accounts[0]
            });
      this.setState({message: 'Congratulations a winner has been chosen...'});
    }
  }
  render() {
    //console.log(web3.version);
    //web3.eth.getAccounts().then(console.log);
    return (
      <div> 
        <h2> Lottery Contract </h2>
        <p> 
        This contract is managed by {this.state.manager} 
        </p>
        <p> 
        There are currently {this.state.players.length}  people entered
        competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether 
        </p>
      <hr />
      <form onSubmit={this.onSubmit} >
        <h1> Wanna try your luck! </h1>
        <h4> Minimum entry level is 0.011 Eth</h4>

        <div>
          <label>Amount of Ether to enter   </label>
          <input
            value={this.state.value}
            onChange= {event => this.setState({value: event.target.value})}
          />

        </div>
          <hr />
          <h4> Enter here and good luck !</h4>
          <button> ENTER </button>
      </form>
         <div>       
              <hr />    
              <h2> {this.state.message} </h2>
          </div>
          <hr />

          <h4> Time to pick a winner </h4>

          <button onClick= {this.onClick}  > Pick a winner </button>
          <hr />
      </div>


    );
  }
}
export default App;
