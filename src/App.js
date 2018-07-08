import React, { Component } from 'react';
// import './App.css';
import './Mirror.css';
// import logo from "./img/mirrorlogo.png";
import { dateline } from "./dateline.js";

class StoryList extends Component {

    constructor(props){
	super(props)

	this.state = {
	    "url": props.url,
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
		    posts.map(post =>
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

    fetchStories(){

	this.setState({"isLoading":true});
		       
	if (this.state.fetchedPages.includes(this.state.page)) {
	    return;
	}

	var that = this;
	
	fetch(this.state.url + "&page=" + this.state.page)
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

	if (
	    (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100)
	    &&!this.state.isLoading
	   ){
	    this.fetchStories()
	    
	}
    }
    
    componentDidMount() {
	// fetch(this.state.url)
	this.fetchStories();

	window.addEventListener('scroll', this.onScroll, false);
    }
    
}

class App extends Component {
    render() {
	return (<div>
		<div className="top-bar">
		<img src={window.location.origin + "/img/mirrorlogo.png"} alt="CT Mirror Logo"/> 
		</div>
		<div className="center-column">
		<StoryList url="https://ctmirror.org/wp-json/wp/v2/posts/?per_page=25"></StoryList>
		</div>
		</div>
	);
    }

    
}

export default App;
