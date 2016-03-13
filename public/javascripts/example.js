/**
 * Example of React Tutorial
 */

/**
 * Tutorial1
 */

// build the CommentBox component, which is just a simple <div>
var CommentBox = React.createClass({
  /*
  getInitialState() executes exactly once during the lifecycle of the component
  and sets up the initial state of the component.
   */
  getInitialState: function () {
    return {data: []};
  },

  /*
   When the component is first created, we want to GET some JSON from the server and update the state
   to reflect the latest data. We're going to use jQuery to make an asynchronous request to the server we
   started earlier to fetch the data we need.
   */
  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({data: data}); // Calling to this.setState() is the key to dynamic updates
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  // componentDidMount is a method called automatically by React after a component is rendered for the first time.
  componentDidMount: function () {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },

  // Note that native HTML element names start with a lowercase letter,
  // while custom React class names begin with an uppercase letter.
  render: function () {
    // Notice how we're mixing HTML tags and components we've built
    return ( // 'this.props.data' is as argument send to CommentBox class
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm />
      </div>
    );
  }
});

/**
 * Tutorial2
 */
var CommentList = React.createClass({
  render: function () {
    // Pass data as comment argument by mapping, i.e.: comment with {id, author, text} structure
    var commentNodes = this.props.data.map(function (comment) {
      return (
        // Passing author to comment class
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>
      )
    });

    return (
      ////Using markdown: surrounding text with asterisks will make it emphasized.
      //<div className="commentList">
      //  <Comment author="Yun Xu">This is one comment</Comment>
      //  <Comment author="Qian Zhu">This is *another* comment</Comment>
      //</div>

      //Now that the data is available in the CommentList, render the comments dynamically
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  render: function () {
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
    );
  }
});

/**
 * Tutorial3
 * create the Comment component, which will depend on data passed in from its parent.
 * Data passed in from a parent component is available as a 'property' on the child component.
 */
var Comment = React.createClass({
  // Make rawMarkup function to protect from an XSS attack
  rawMarkup: function () {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup};
  },

  // These 'properties' are accessed through this.props. Using props, we will be able to
  // read the data passed to the Comment from the CommentList
  render: function () {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

// Define data to pass
var data = [
  {id: 1, author: "Yun Xu", text: "This is one comment"},
  {id: 2, author: "Qian Zhu", text: "This is *another* comment"}
];

// It is important that ReactDOM.render remain at the bottom of the script for this tutorial.
// ReactDOM.render should only be called after the composite components have been defined.
ReactDOM.render(
  //<CommentBox data={data}/>, // Get hard-coded data into CommentList in a modular way
  <CommentBox url="/api/comments" pollInterval={2000} />, //  replace the hard-coded data with some dynamic data from the server
  document.getElementById('content')
);
