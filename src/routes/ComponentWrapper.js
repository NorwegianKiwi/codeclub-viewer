import React, {PropTypes as PT} from 'react';


const Dummy = () => {
  const html = {__html: '<div id="DoWeNeedThisId">TODO: Insert static HTML her instead</div>'};
  console.log('Inserting html:', html.__html);
  return <div dangerouslySetInnerHTML={html}/>;
};


export const setPage = (wrapperObj, page) => {
  if (wrapperObj.callback) {
    wrapperObj.callback(page);
    delete wrapperObj.callback;
  } else if (!wrapperObj.page) {
    wrapperObj.page = page;
  }
};

export const ComponentWrapper = React.createClass({
  getInitialState() {
    return {showPage: !!this.props.wrapperObj.page};
  },
  componentWillMount() {
    if (!this.props.wrapperObj.page) {
      this.props.wrapperObj.callback = (page) => {
        this.props.wrapperObj.page = page;
        this.setState({showPage: true});
      };
    }
  },
  render() {
    return <div id={this.props.id}>
      {this.state.showPage ? <this.props.wrapperObj.page {...this.props}/> : <Dummy/>}
    </div>;
  }
});
ComponentWrapper.propTypes = {
  id: PT.string.isRequired,
  wrapperObj: PT.object.isRequired
};
