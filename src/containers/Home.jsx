import React from 'react';

class Home extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			summonerName: '',
			region: 'na1',
			names: [],
			error: null,
		}
		// bind class methods with `this`
		this.handleInput = this.handleInput.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	getFriendSuggestions (region, summonerName) {
		const that = this;
		// make request
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `/friends-suggestions/${region}/${summonerName}`);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.addEventListener('readystatechange', function () {
		  if (this.readyState === 4) {
			console.log('this', this);
			if (this.status === 200) {
				const response = JSON.parse(this.response);
				console.log('200 response', response);
				that.setState({
					names: response.data,
					error: null,
				});
			} else {
				if (this.status === 404) {
					that.setState({
						names: [],
						error: 'no summoner was found',
					});
				} else {
					const response = JSON.parse(this.response);
					that.setState({
						names: [],
						error: response.message,
					});
				}
			}
		  }
		});
		xhr.send();
	}
	handleInput (e) {
		e.preventDefault();
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value});
	}
	handleSubmit (e) {
		e.preventDefault();
		this.getFriendSuggestions(this.state.region, this.state.summonerName);
	}
	render () {
		return (
			<div id="home-screen" className="flex-container flex-container--column flex-container--center-center">
				<div id="small-screen" className="card">
				<div className="card--title">
					<h4>LoL Friend Finder v0.0.1</h4>
				</div>
				<div className="card--body">
					<h4>SEARCH</h4>
					<p>Search your summoner name to get friend suggestions</p>
					<p>Note: no information is stored on our server, we simply make a call to riot's apis, do some processing, and return the result.</p>
					<p style={{color: 'red'}}>{this.state.error}</p>
					<form onSubmit={this.handleSubmit}>
						<div className="form-group">
							<label htmlFor="summonerName">Summoner Name</label>
							<input type="text" className="form-control" name="summonerName" value={this.state.summonerName} onChange={this.handleInput}/>
						</div>
						<div className="form-group">
							<label htmlFor="region">Region</label>
							<input type="text" className="form-control"  name="region" value={this.state.region} onChange={this.handleInput}/>
						</div>
						<button type="submit" className="btn btn-primary">submit</button>
					</form>
					<ul>
						{this.state.names.map(function(names, index){
							return <li key={ index }>{names}</li>;
						})}
					</ul>
				</div>
					
				</div>
			</div>
		);
	}
}

module.exports = Home;