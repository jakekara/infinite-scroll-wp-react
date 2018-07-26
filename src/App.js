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
	    "readList":window.localStorage.getItem("readList") || {},
	    "categoryList":null
	}
    }

    categoryName(cid){

	if (!this.state.categoryList){ return; }	

	console.log(cid, this.state.categoryList.map( d => d.id) );
	
	var matches = this.state.categoryList.filter(d => d.id === cid);

	if (matches.length !== 1){ return; }

	return matches[0].name;

    }

    categoryNames(carray){
	var that = this;
	var ret =  carray.map(function(cid){
	    return that.categoryName.call(that, cid);
	});

	if (ret.length < 1){ return ret; }
	
	return [ret[0]];
    }
    

    render(){

	const posts = this.state.posts;

	return (
		<div className="story-list">
		{
		    posts.map(
			post =>
			    <div className="story-preview-container">

			    <div className="story-preview" data-category={this.categoryNames(post.categories).join(" ")}>
			    <div className="category-tag-container">
			    <div className="category-tag">
			    {this.categoryNames(post.categories).join(" ")}
			</div>
			    </div>
			    <a key={post.id} href={post.link}>			    			    
			    <div className="headline-group">
			    <div className="read-status" />

			    <span  className="headline" dangerouslySetInnerHTML={{ __html:post.title.rendered }} />
			    </div>
			    </a>			    
			    
			    <div className="dateline">{dateline(new Date(post.date))}</div>
			    </div>

			</div>
			    
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

    fetchCategories(){
	this.setState({"categoryListIsLoading":true});

	var url = this.props.url + "/categories?per_page=100";
	console.log("CategoryList URL: " , url);

	var that = this;
	fetch(url)
	    .then(response => response.json())
	    .then(function(data){
		console.log("fetched category list", data)
		that.setState({
		    "categoryList": data,
		    "categoryListIsLoading":false
		});
	    });
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
	this.fetchCategories();

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
