import React, { Component } from 'react';
import Eos from 'eosjs'; // https://github.com/EOSIO/eosjs

// material-ui dependencies
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';

// NEVER store private keys in any source code in your real life development
// This is for demo purposes only!
const accounts = [
  {"name":"useraaaaaaaa", "privateKey":"5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5", "publicKey":"EOS6kYgMTCh1iqpq9XGNQbEi8Q6k5GujefN9DSs55dcjVyFAq7B6b"},
  {"name":"useraaaaaaab", "privateKey":"5KLqT1UFxVnKRWkjvhFur4sECrPhciuUqsYRihc1p9rxhXQMZBg", "publicKey":"EOS78RuuHNgtmDv9jwAzhxZ9LmC6F295snyQ9eUDQ5YtVHJ1udE6p"},
  {"name":"useraaaaaaac", "privateKey":"5K2jun7wohStgiCDSDYjk3eteRH1KaxUQsZTEmTGPH4GS9vVFb7", "publicKey":"EOS5yd9aufDv7MqMquGcQdD6Bfmv6umqSuh9ru3kheDBqbi6vtJ58"},
  {"name":"useraaaaaaad", "privateKey":"5KNm1BgaopP9n5NqJDo9rbr49zJFWJTMJheLoLM5b7gjdhqAwCx", "publicKey":"EOS8LoJJUU3dhiFyJ5HmsMiAuNLGc6HMkxF4Etx6pxLRG7FU89x6X"},
  {"name":"useraaaaaaae", "privateKey":"5KE2UNPCZX5QepKcLpLXVCLdAw7dBfJFJnuCHhXUf61hPRMtUZg", "publicKey":"EOS7XPiPuL3jbgpfS3FFmjtXK62Th9n2WZdvJb6XLygAghfx1W7Nb"},
  {"name":"useraaaaaaaf", "privateKey":"5KaqYiQzKsXXXxVvrG8Q3ECZdQAj2hNcvCgGEubRvvq7CU3LySK", "publicKey":"EOS5btzHW33f9zbhkwjJTYsoyRzXUNstx1Da9X2nTzk8BQztxoP3H"},
  {"name":"useraaaaaaag", "privateKey":"5KFyaxQW8L6uXFB6wSgC44EsAbzC7ideyhhQ68tiYfdKQp69xKo", "publicKey":"EOS8Du668rSVDE3KkmhwKkmAyxdBd73B51FKE7SjkKe5YERBULMrw"}
];

// set up styling classes using material-ui "withStyles"
const styles = theme => ({
  card: {
    margin: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  formButton: {
    marginTop: theme.spacing.unit,
    width: "100%",
  },
  pre: {
    background: "#ccc",
    padding: 10,
    marginBottom: 0.
  },
});

// Index component
class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      contracts: [],
      contract: "Create",
      userContracts: [],
      user: "",
    };
    this.handleFormEvent = this.handleFormEvent.bind(this);
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target.name + ":" + event.target.value)
  };

  handleUserChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // generic function to handle form events (e.g. "submit" / "reset")
  // push transactions to the blockchain by using eosjs
  async handleFormEvent(event) {
    // stop default behaviour
    event.preventDefault();

    // collect form data
    let company = event.target.user.value;
    let employee = event.target.employee.value;
    let companyAddress = event.target.companyAddress.value;
    let employeeAddress = event.target.employeeAddress.value;
    let privateKey = event.target.companyPrivateKey.value;
    let content = event.target.content.value;
    let contractName = event.target.contractName.value;
    //let contractKey = event.target.

    // prepare variables for the switch below to send transactions
    let actionName = "";
    let actionData = {};

    // define actionName and action according to event type
    console.log(this.state)
    switch (event.type) {
      case "submit":
        if(this.state.contract === "Create"){
          actionName = "create";
          actionData = {
            _employee:        employee,
            _content:         content,
            _company:         company,
            _employeeAddress: employeeAddress,
            _companyAddress: companyAddress,
            _contractName: contractName
          };
        }
        else{
           actionName = "sign";
           actionData = {
            _user:        company,
            contract_prim_key:     this.state.contract
          };
        }
        
        break;
      default:
        return;
    }

    // eosjs function call: connect to the blockchain
    const eos = Eos({keyProvider: privateKey});
    const result = await eos.transaction({
      actions: [{
        account: "ndaacc",
        name: actionName,
        authorization: [{
          actor: company,
          permission: 'active',
        }],
        data: actionData,
      }],
    });

    console.log(result);
    this.getTable();
  }

  // gets table data from the blockchain
  // and saves it into the component state: "noteTable"
  getTable() {
  console.log("inside get table")
    const eos = Eos();
    eos.getTableRows({
      "json": true,
      "code": "ndaacc",   // contract who owns the table
      "scope": "ndaacc",  // scope of the table
      "table": "records1",    // name of the table as specified by the contract abi
      "limit": 100,
    }).then(result =>{
      console.log('table found ')
      this.setState({ contracts: result.rows });
      
      console.log(result.rows);
    } );
  }

  componentDidMount() {
    console.log("calling get table")
    this.getTable();
  }

  render() {

 // var obj = {a:1,b:2}
  //var {a} = obj; // var a = obj['a']
    
    const { classes } = this.props;
    //const contractItems = this.state.contracts ? this.state.contracts : [];
    const {contracts} = this.state;

    //const contractItems  = this.state.contracts;
    const generateContractItem = (key, name) => (
      <MenuItem value={key}>{name}</MenuItem>
    );
    let contractElements = contracts.map((row, i)=>{
      return generateContractItem(row.prim_key, row.contractName);
    });
    console.log("...."+ contractElements.length)
    console.log(contractElements)
    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Clear Contract
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Paper className={classes.paper}>
          <form onSubmit={this.handleFormEvent}>
            <TextField
              name="user"
              autoComplete="off"
              label="User"
              margin="normal"
              fullWidth
              onChange={this.handleChange}
            />
            <TextField
              name="companyPrivateKey"
              autoComplete="off"
              label="Company Private key"
              margin="normal"
              fullWidth
            />
            <Select
              value={this.state.contract.prim_key}
              onChange={this.handleChange}
              input={<Input name="contract" id="contract" />}
              label="Select Contract"
              fullWidth
            >
              <MenuItem value="create">
                <em>Create</em>
              </MenuItem>
              {contractElements}
            </Select>
            <TextField
              name="companyAddress"
              autoComplete="off"
              label="Company Address"
              margin="normal"
              fullWidth
            />
            <TextField
              name="employee"
              autoComplete="off"
              label="Employee to sign"
              margin="normal"
              fullWidth
            />
            <TextField
              name="employeeAddress"
              autoComplete="off"
              label="Employee Address"
              margin="normal"
              fullWidth
            />

            <TextField
              name="contractName"
              autoComplete="off"
              label="Name of contract"
              margin="normal"
              fullWidth
            />

            <TextField
              name="content"
              autoComplete="off"
              label="Contract"
              margin="normal"
              multiline
              rows="30"
              fullWidth
            />

            <Button
              variant="contained"
              color="primary"
              className={classes.formButton}
              type="submit">
              Sign
            </Button>
          </form>
        </Paper>
        <pre className={classes.pre}>
          Below is a list of pre-created accounts information for add/update note:
          <br/><br/>
          accounts = { JSON.stringify(accounts, null, 2) }
        </pre>
      </div>
    );
  }

}

export default withStyles(styles)(Index);
