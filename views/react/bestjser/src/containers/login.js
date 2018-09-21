import { connect } from 'react-redux';
import login from '../components/login';
import {LOGINACTION,TESTACTION} from '../actions/index';

const mapStateToProps = (state) => ({
    text: (()=>{
      return state.login.text;
    })(),
    show:state.show
  })
  
const mapDispatchToProps = (dispatch,ownProps) => ({
    onClick: () => dispatch(LOGINACTION("111111111")),
    dbClick: () => dispatch(TESTACTION(ownProps.show))
  })

export default connect(
    mapStateToProps,mapDispatchToProps
)(login);