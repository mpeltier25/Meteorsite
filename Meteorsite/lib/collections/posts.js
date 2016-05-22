Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});
Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.lastName || errors.firstName;
  }
});


	//Regex from http://www.w3resource.com/javascript/form/letters-numbers-field.php
    /*
    * Regex that only accepts letter inputs
    */
	function allLetter(inputtxt)  
      {  
       var letters = /^[A-Za-z]+$/;  
       if(inputtxt.match(letters))  
         {  
          return true;  
         }  
       else  
         {  
         return false;  
         }  
      } 
    /*
    * Regex that only accepts letter and number inputs
    */
      function alphanumeric(inputtxt)  
      {  
      	  var letterNumber = /^[0-9a-zA-Z]+$/;  
      	  if(inputtxt.match(letterNumber))   
      	  	  {  
      	  	  	  return true;  
      	  	  }  
      	  	  else  
      	  	  {      
      	  	  	  return false;   
      	  	  }  
      }
       /*
    * Regex that only accepts number inputs
    */
          function onlynumbers(inputtxt)  
       {  
          var numbers = /^[0-9]+$/;  
          if(inputtxt.match(numbers))  
          {   
          return true;  
          }  
          else  
          {  
          return false;  
          }  
       }
       
    /*
    * Regex that only accepts valid emails
    */
          function ValidateEmail(mail)   
          {  
          	  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
          	  {  
          	  	  return (true)  
          	  }   
          	  return (false)  
          }  


validatePost = function (post) {
  var errors = {};
  
  if (!post.firstName || allLetter(post.firstName)==false){
  	errors.firstName="True";
    alert("Please use all letters for the first name field");
  }
  if (!post.lastName || allLetter(post.lastName)==false){
  	errors.lastName="True";
    alert("Please use all letters for the last name field");
  }
  	 if(!post.primaryContactEmail || (post.primaryContactEmail.toLowerCase().indexOf("@gmail.com")==-1 && post.primaryContactEmail.toLowerCase().indexOf("@Live.com") == -1)  || ValidateEmail(post.primaryContactEmail)==false){
  	 	 errors.primaryContactEmail = "True";
  	 	alert("Please enter in a valid Partners-affliated address (@gmail.com, @Live.com)")
 }
  
  return errors;
}

Meteor.methods({
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      lastName: String,
      firstName: String,
      primaryContactEmail: String,
    });
    
    var errors = validatePost(postAttributes);
    if (errors.lastName || errors.firstName)
      throw new Meteor.Error('invalid-post', "");
    
    var postWithSameLink = Posts.findOne({firstName: postAttributes.firstName});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }
    
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id, 
      author: user.username, 
      submitted: new Date()
    });
    
    var postId = Posts.insert(post);
    
    return {
      _id: postId
    };
  }
});
