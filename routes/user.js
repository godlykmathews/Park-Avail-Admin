var express = require('express');
const { response } = require('../app');
var router = express.Router();
var productHelper = require('../helpers/product-helper')
var userHelper = require('../helpers/user-helper')
/* GET home page. */
router.get('/', function (req, res, next) {
  let user=req.session.user

  productHelper.getAllProducts().then((products) => {
    res.render('user/view-place', { products,user});
  })
});

// View all places filtered by district
router.get('/place', async (req, res) => {
  try {
      const district = req.query.district; // Get district from query parameters
      let products = await productHelper.getAllProducts();

      products = products
          .filter(product => product.district === district) // Filter products by selected district
          .map((product, index) => {
              return { ...product, counter: index + 1 };
          });

      res.render('user/view-place', { 
          products,
          admin: true,
          district // Pass the district to the view for future use
      });

  } catch (err) {
      req.session.message = {
          type: 'error',
          text: 'Error fetching places'
      };
      res.redirect('/admin');
  }
});

router.get('/login', (req, res) => {
  if(req.session.loggedIn){
    res.redirect('/');
  }else{
    res.render('user/login', { "loginErr": req.session.loginErr });
    req.session.loginErr=false
  }  
})

router.get('/signup', (req, res) => {
  res.render('user/signup')
})
router.post('/signup', (req, res) => {

  userHelper.doSignup(req.body).then((response) => {
    console.log(response);
    res.redirect('/login')
  })
})
router.post('/login', (req, res) => {
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr="Invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',(req,res)=>{
  res.render('user/cart')
})

module.exports = router;