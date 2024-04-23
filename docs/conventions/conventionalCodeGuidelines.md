# Coding and Styling Guidelines 

## 1. Javascript Guidelines

#### 1.1 Consistent Formatting :
- Use the same indentation, spacing, and line breaks throughout your code to allow for code to be easier to read and understand.
	
    #### Example 
	```javascript
    function greet(name){
        console.log("Hello, " + name + "!");
    }

    greet("Fluffy");
	```

#### 1.2 Naming Conventions and Declarations:
- Declare all variables using keywords such as let and const, not var.
- Choose names for variables, functions, and classes that are clear, concise and descriptive.
- Use the camelCase convention for variables and functions and the PascalCase convention for classes.
- Avoid using abbreviations for naming conventions. 
    #### Example
    
    ```javascript
    class AnimalShelter {
        // ...
    }

    function calculateTotalPets(numDogs, numCats) { 
        // ...
    }

    let petName = "Fluffy";
    ```


#### 1.3 Comments: 
- Mark single-line comments with `//`.
- Keep comments as short as possible, roughly within 60–80 characters where necessary. 
- When adding multiple line comments (3 or more lines) use  `/* ... */` to enclose all comments.
- Leave a space between the slashes and the comment.
- Mark todo actions with `TODO`
- When adding a comment to code that does not start on a new indentation level, leave an empty line so that it is clear which block of code the comment is referring to.
- To help understand what the expected output of certain functions are, place a comment after the function call with the expected output.
    
    #### Example
    ```javascript
	// Define a cat object
    let cat = {
  	    name: "Whiskers",
  	    color: "Brown",

  	    // Describe the cat's meow
  	    meow() {
            console.log("Meow!");
  	    }
	};

	cat.meow(); // Output: Meow!
	```
#### 1.4 Arrays:
- When creating arrays define them using literals
	``` javascript	
    const petList = [];
    ```
- When adding elements to an array, do not directly assign elements to the array. Instead use the .push() function.
		
     ```javascript
    petList.push("tortoise");
    ```
#### 1.5 Loops:
- When iterating through a collection of elements, use the `for ... of` or `forEach()` notation. Avoid use the traditional loop method. 
- When using the `for ... of` notation, initialise the loop using the const keyword.

    #### Example
     ```javascript
	const animals = ["dog", "cat", "bird", "fish"];
	
    // Using for...of
    for (const animal of animals) {
  	       console.log(
  	}  
  
	// Using forEach()
	animals.forEach(function(animal) {
  		console.log(animal);
	};
	```



#### 1.6 Conditional Statement:
- Despite single line control statements not requiring braces, always use them for `if`, `for`, and `while` statements to provide clarity.

#### 1.7 Operators:
- Where required, use the strict equality operator `(===)` as opposed to the loose equality operator `(==)`. This applies to inequality operators as well.



## 2. HTML and CSS Guidelines

#### 2.1 Indentation and Spacing
- Use two spaces for indentation to improve code readibility.
    #### Example
    ```HTML
    <div>
      <p>Indented content</p>
    </div>
    ```
    
- Use a single space between attributes as it makes HTML tags more readable.
    #### Example
    ```HTML
        <a href="https://example.com" title="Visit Example">Link</a>
    ```

#### 2.2 HTML Quotations
- Use double quotes for attribute values so that there is consistency and uniformity.
    #### Example
    ```HTML
        <img src="image.jpg" alt="Description">
    ```

#### 2.3 Line Length 
- Limit lines to 80 characters as best as you can  as short lines prevent horizontal scrolling and enhance readability.

#### 2.4 Class Naming
- Use hyphen-separated lowercase class names that are descriptive allowing for maintainability.
   #### Example
  ```HTML
    <div class="my-section">
        <p class="highlight-text">Important content</p>
    </div>
    ```

#### 2.5 CSS Property Ordering 
- Order properties alphabetically to allow for easy maintenance and quick look-ups.
    #### Example
  ```CSS
    my-element {
        background-color: #fff;
        color: #333;
        font-size: 16px;
    }
    ```
#### 2.6 CSS Selectors
- Prefer class selectors over element selectors to promote reusability and specificity.
    #### Example
    ``` CSS
    .my-button {
        /* Styles for buttons */
    }
    ```

#### 2.7 Comments
- Use block comments that clarify the code's intent.
     #### Example
     ```CSS
    /* Header styles */
    .header {
        font-size: 24px;
        /* Other properties */
    }
    ```

#### References:

[1] MDN Web Docs. (2023). "Guidelines for writing JavaScript code examples". [Online] Available at: https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript [Last Accessed 23 Apr. 2024].

[2] Google. (n.d) "Google HTML/CSS Style Guide". [Online] Available at: https://google.github.io/styleguide/htmlcssguide.html [Last Accessed 23 Apr. 2024].

‌