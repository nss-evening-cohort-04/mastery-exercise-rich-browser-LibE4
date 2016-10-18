# Toy Consignment Shop

You are going to create an application for a consignment store specializing in children's toys. Use Google image search to find some toys for your store.

## SASS Automation

You must use SASS to style your application. Using Grunt, set up a task to automate the transpilation of SASS to CSS for inclusion in your application.

## Firebase Structure

Create a new Firebase application. There will only be one collection, named `toys`.

### Toy Data

Each toy will need the following properties.

1. Name
2. Price
3. Image URL
4. Short description

## Views

You will need 3 views in this application. 

### List all toys

When viewing all toys, provide a text box on the screen that will allow the user to filter the toys on the product name. Use Bootstrap for laying the toys out in a grid.

### View individual toy details

Create a basic view that shows the toy name as a title, the toy image, and the price. Ensure there is an affordance for the user to easily get back to the list of toys.

### Add / delete toy

Create a form for addding a new toy to Firebase. Make sure the form fields match the format you defined in your toys collection.  

You will also need to add a button to each toy that allows the user to delete it from the list and from Firebase.

## Stretch goals
1. Add a form for editing a toy and saving the changes.   
2. Create a form for registering/logging in a user. 
3. When the signed-in user adds a toy to Firebase, save the user id to the toy. 
4. Allow the user to view only toys he/she added to the db.  

