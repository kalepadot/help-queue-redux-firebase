import React from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import EditTicketForm from './EditTicketForm';
import { connect } from 'react-redux';
import * as a from './../actions';
import { withFirestore } from 'react-redux-firebase';

class TicketControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      // formVisibleOnPage: false, //local state: determines whether or not a form should show on the page
      selectedTicket: null, //local state: determines whether our Ticket Detail component should show or not 
      editing: false
    };
  }

  // componentDidMount() {
  //   this.waitTimeUpdateTimer = setInterval(() =>
  //     this.updateTicketElapsedWaitTime(),
  //   60000
  //   );
  // }

  // componentWillUnmount(){
  //   clearInterval(this.waitTimeUpdateTimer);
  // }

  handleClick = () => {
    if (this.state.selectedTicket != null) {
      this.setState({
        selectedTicket: null,
        editing: false
      });
    } else {
      const { dispatch } = this.props;
      const action = a.toggleForm();
      dispatch(action);
    }
  }

  handleAddingNewTicketToList = () => {
    const { dispatch } = this.props;
    const action = a.toggleForm();
    dispatch(action);
  }

  handleChangingSelectedTicket = (id) => {
    this.props.firestore.get({collection: 'tickets', doc: id}).then((ticket) => {
      const firestoreTicket = {
        names: ticket.get("names"),
        location: ticket.get("location"),
        issue: ticket.get("issue"),
        id: ticket.id
      }
      this.setState({selectedTicket: firestoreTicket});
    });
  }

  handleDeletingTicket = (id) => {
    this.props.firestore.delete({collection: 'tickets', doc: id}); 
    this.setState({selectedTicket: null});
  }

  handleEditClick = () => {
    this.setState({editing: true});
  }

  handleEditingTicketInList = () => {
    this.setState({
      editing: false,
      selectedTicket: null
    });
  }

  render(){
    let currentlyVisibleState = null;
    let buttonText = null;
    if (this.state.editing ) {      
      currentlyVisibleState = <EditTicketForm ticket = {this.state.selectedTicket} onEditTicket = {this.handleEditingTicketInList} />
      buttonText = "Return to Ticket List";
    } else if (this.state.selectedTicket != null) {
      currentlyVisibleState = <TicketDetail 
        ticket = {this.state.selectedTicket} 
        onClickingDelete = {this.handleDeletingTicket} 
        onClickingEdit = {this.handleEditClick} />
      buttonText = "Return to Ticket List";
    } else if (this.props.formVisibleOnPage) {
      currentlyVisibleState = <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList}  />;
      buttonText = "Return to Ticket List";
    } else {
      currentlyVisibleState = <TicketList onTicketSelection={this.handleChangingSelectedTicket} />;
      buttonText = "Add Ticket";
    }
    return (
      <React.Fragment>
        {currentlyVisibleState}
        <button onClick={this.handleClick}>{buttonText}</button>
      </React.Fragment>
    );
  }

}

const mapStateToProps = state => {
  return {
    formVisibleOnPage: state.formVisibleOnPage
  }
}

TicketControl = connect(mapStateToProps)(TicketControl);

export default withFirestore(TicketControl);