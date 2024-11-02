var express = require('express');
var router = express.Router();
var productHelper = require('../helpers/product-helper');

// View all places
router.get('/', async (req, res) => {
    try {
        let products = await productHelper.getAllProducts();

        products = products.map((product, index) => {
            return { ...product, counter: index + 1 };
        });

        res.render('admin/view-place', { 
            products,
            admin: true
        });
    } catch (err) {
        req.session.message = {
            type: 'error',
            text: 'Error fetching places'
        };
        res.redirect('/admin');
    }
});

// Render add place form
router.get('/add-place', function(req, res) {
    res.render('admin/add-place', { admin: true });
});

// Add new place
router.post('/add-place', async (req, res) => {
    try {
        const imageFile = req.files?.image; // Handle image file upload
        const insertedId = await productHelper.addProduct(req.body); // Save the form data and get the inserted ID
        
        if (imageFile) {
            // Move the uploaded file to the public directory
            const imagePath = './public/product-images/' + insertedId + '.jpg';
            await imageFile.mv(imagePath);
        }

        req.session.message = {
            type: 'success',
            text: 'Place added successfully'
        };
        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding place:', error);
        req.session.message = {
            type: 'error',
            text: 'Failed to add place'
        };
        res.redirect('/admin/add-place');
    }
});


// Delete place
router.get('/delete-place/:id', async (req, res) => {
    try {
        const placeId = req.params.id;
        await productHelper.deleteProduct(placeId);
        
        req.session.message = {
            type: 'success',
            text: 'Place deleted successfully'
        };
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting place:', error);
        req.session.message = {
            type: 'error',
            text: 'Failed to delete place'
        };
        res.redirect('/admin');
    }
});

// Render edit place form
router.get('/edit-place/:id', async (req, res) => {
    try {
        const placeId = req.params.id;
        const place = await productHelper.getProductById(placeId); // Fetch the place from DB

        if (place) {
            // Render the edit-place view and pass the 'place' object to it
            res.render('admin/edit-place', { place, admin: true });
        } else {
            req.session.message = {
                type: 'error',
                text: 'Place not found'
            };
            res.redirect('/admin');
        }
    } catch (error) {
        console.error('Error fetching place for editing:', error);
        req.session.message = {
            type: 'error',
            text: 'Error fetching place for editing'
        };
        res.redirect('/admin');
    }
});


// Handle edit place form submission
router.post('/edit-place/:id', async (req, res) => {
    try {
        const placeId = req.params.id;
        const updatedData = req.body;

        await productHelper.updateProduct(placeId, updatedData);

        req.session.message = {
            type: 'success',
            text: 'Place updated successfully'
        };
        res.redirect('/admin');
    } catch (error) {
        console.error('Error updating place:', error);
        req.session.message = {
            type: 'error',
            text: 'Failed to update place'
        };
        res.redirect('/admin');
    }
});




module.exports = router;
