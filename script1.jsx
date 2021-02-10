class RecipeApp extends React.Component {
	constructor(props) {
  	super(props);
		this.state = {
            ingredients: [],
            ingNum: 0,
            recipePush: false,
            recipeList: [],
            error: false
    };
    this.addIngredients = this.addIngredients.bind(this);
    this.bulletList = this.bulletList.bind(this);
    this.findRecipe = this.findRecipe.bind(this);
    this.reset = this.reset.bind(this);
  }
  
  addIngredients() {

  	if (document.getElementById('form').value === '') {

        this.setState ({
            error: true
        })

      } else if (document.getElementById('form').value !== '') {
    
    this.setState ({
    
		ingredients: [...this.state.ingredients, document.getElementById('form').value], 
        ingNum: this.state.ingNum + 1,
        error: false
    
    });

    document.getElementById('form').value = ""
}
  }

  bulletList() {
  
  	let itemList = this.state.ingredients.map((x, i) => {
      <li key={i}>{x}</li>
      })
        
    return (
        <ul>{itemList}</ul>
        )                                          
    } 
      
  findRecipe() {
  	console.log('Finding Recipes');
    
    this.setState ({
    
    	recipePush: true
    
    });
		
    let ingURL = this.state.ingredients.join('%2C');
    
    fetch(`https://recipe-puppy.p.rapidapi.com/?i=${ingURL}`, {
        method: "GET",
        headers: {
            // this API key is old - need to figure out how to hide it
            // "x-rapidapi-key": "",
		    "x-rapidapi-host": "recipe-puppy.p.rapidapi.com"
        }
    })
    	.then ((res) => res.json())
        .then ((data) => {
        
        this.setState({
        	
          recipeList: data.results
        
        })

    })

        }

    reset() {
        this.setState({
            recipeList: [],
            ingredients: [],
            recipePush: false,
            ingNum: 0
        })
    }
    
  render() {
      
    let segment;
  	if (this.state.recipePush === false) {
    	segment = <Recipes recipeList=""/>;
    } else if (this.state.recipePush === true) {
    	segment = <Recipes recipeList={this.state.recipeList} />;
    }
        
  	return (
    	<div>
        <Header />
        
        <Ingredients addIngredients={this.addIngredients} ingredientList={this.state.ingredients} bulletList={this.bulletList()} ingNum={this.state.ingNum} findRecipe={this.findRecipe} reset={this.reset} error={this.state.error} />
        
        {segment}       
        
    	</div>
    )
  }
}

class Ingredients extends React.Component {
	constructor(props) {
  	super(props);
  }
  
  render() {
    let errorMessage = '';
    if (this.props.error === false) {
        errorMessage = ''
    } else if (this.props.error === true) {
        errorMessage = 'Please input an ingredient :)'
    }

    const keyPress = e => {
        if (e.key === 'Enter') {
            {this.props.addIngredients()};
        }
    }

  	return(
    	<div>
            <input id='form' key='form' type='text' onKeyPress={keyPress}></input>
            <label className='error'> {errorMessage}</label>
            <br />
            <button id='submit' key='submit' className='submit' onClick={this.props.addIngredients}>Submit Ingredient</button>
            <button id='recipe' key='recipe' className='recipe' onClick={this.props.findRecipe}>Look for Recipe</button>
            <button id='reset' key='reset' className='reset' onClick={this.props.reset}>Reset</button>
            <div className='lists'>
                <p className='listHeader'>Ingredient List</p>
                <ul className='ingredientList' key={this.props.ingNum}>
                    {this.props.bulletList}
                </ul>
            </div>
    	</div>
    )
  }
  
}

class Header extends React.Component {
	constructor(props) {
  	super(props);
  }
  
  render() {
  	return(
    	<div>
    	    <h2 className='header'>Roger's Recipe App</h2>
            <h4 className='dir'>Please submit your ingredients one at a time below,</h4>
            <h4 className='dir2'>and we'll pull up some recipes containing those ingredients!</h4>
    	</div>
    )
  }
  
}

class Recipes extends React.Component {
	constructor(props) {
  	super(props);
  }
  
  render() {

    let recTitles = [];
    let recLinks = [];
    for (let i=0 ; i < this.props.recipeList.length ; i++) {
        recTitles.push(this.props.recipeList[i].title);
        recLinks.push(this.props.recipeList[i].href);
    };

  	return(
    	<div className="recipes">
          <p>Recipe List</p>            
    	  <ul className='resList'>
            { recTitles.map ((x, i) => 
                <li key={i}><a href={recLinks[i]} target="_blank">{x}</a></li>
                )
            }
          </ul>
      </div>
    )
  }
  
}


ReactDOM.render(<RecipeApp />, document.getElementById('react-app'))