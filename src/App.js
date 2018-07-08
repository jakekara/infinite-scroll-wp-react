import React, { Component } from 'react';
// import './App.css';
import './Mirror.css';
// import logo from "./img/mirrorlogo.png";
import { dateline } from "./dateline.js";

class StoryList extends Component {

    constructor(props){
	super(props)

	this.state = {
	    "perPage":25,
	    "url":props.url,
	    "fetchedPages":[],
	    "page":1,
	    "posts":[],
	    "readList":window.localStorage.getItem("readList") || {}
	}
    }

    render(){

	const posts = this.state.posts;

	return (
		<div className="story-list">
		{
		    posts.map(
			post =>
			    <a href={post.link}>
			      
			    <div className="story-preview" key={post.id}>
			    <div className="headline-group">
			    <div className="read-status" />

			    <span  className="headline" dangerouslySetInnerHTML={{ __html:post.title.rendered }} />
			    </div>
			    <div className="dateline">{dateline(new Date(post.date))}</div>
			    </div>
			    </a>
			      
		    )
		}
	    </div>
	);
    }

    checkUrl(){

	if (this.props.url !== this.state.url){
	    console.log("Fixing url and resetting posts");
	    this.setState({"url":this.props.url,
			   "posts":[],
			   "fetchedPages":[],
			   "page":1});
	}

    }	

    fetchStories(){

	this.setState({"isLoading":true});
	
	if (this.state.fetchedPages.includes(this.state.page)) {
	    return;
	}

	var that = this;

	var goodUrl = this.props.url + "/posts" + "?per_page=" + this.state.perPage + "&page=" + this.state.page;
	console.log("url", goodUrl);
	fetch(goodUrl)
	    .then(response => response.json())
	    .then(function(data){
		console.log(data)
		that.setState({
		    "posts": that.state.posts.concat(data),
		    "page": that.state.page + 1,
		    "fetchedPages":that.state.fetchedPages.concat([that.state.page]),
		    "isLoading":false
		});
	    });
    }

    onScroll = () => {

	this.checkUrl();
	
	if (
	    (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100)
		&&!this.state.isLoading
	){
	    this.fetchStories()
	    
	}
    }
    
    componentDidMount() {

	this.fetchStories();

	window.addEventListener('scroll', this.onScroll, false);
    }
    
}

class UrlForm extends Component {
    constructor(props){

	super(props);
	
	this.state = {
	    "value":props.url
	}

	this.handleChange = this.handleChange.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleChange(event) {
	this.setState({value: event.target.value});
    }

    handleSubmit(event) {

	event.preventDefault();

	this.props.updateUrl(this.state.value);

    }

    render() {
	return (
	        <form className="url-form" onSubmit={this.handleSubmit}>
		<label>
		API endpoint: 
	        <input type="text" value={this.state.value} onChange={this.handleChange} />
		</label>
		<input type="submit" value="Update" />
		<div className="hint">
		(After change the API endpoint, start scrolling to fetch new stories)
		</div>
		</form>
	);
    }
}


class App extends Component {

    constructor(props){
	super(props);

	this.state = {
	    "url":"https://ctmirror.org/wp-json/wp/v2"
	    // "url":"https://denverpost.com/wp-json/wp/v2"
	}

	this.updateUrl = this.updateUrl.bind(this)
    }

    updateUrl(url){
	this.setState({"url":url});
    }
    
    render() {
	return (
		<div>
		<div className="top-bar">
		<img src={window.location.origin + "/img/mirrorlogo.png"} alt="CT Mirror Logo"/> 
		</div>

		<div className="center-column">
		<UrlForm url={this.state.url} updateUrl={this.updateUrl}/>		
		<StoryList url={this.state.url}></StoryList>
		</div>
		</div>
	       );
    }

    
}

export default App;
