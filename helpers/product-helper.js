const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb"); // Using destructuring for better clarity

module.exports = {
  addProduct: (product) => {
    return new Promise((resolve, reject) => {
      const dbConnection = db.get();
      if (!dbConnection) {
        return reject(new Error("Database not connected"));
      }

      product.createdAt = new Date();
      product.availability = product.availableButton === "on"; // Check if availability is set

      dbConnection
        .collection(collection.PRODUCT_COLLECTION)
        .insertOne(product)
        .then((data) => {
          resolve(data.insertedId); // Return the inserted ID to use for file naming
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      const dbConnection = db.get();
      if (!dbConnection) {
        return reject(new Error("Database not connected"));
      }

      dbConnection
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .sort({ createdAt: -1 })
        .toArray()
        .then((products) => {
          resolve(products);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getProductById: (productId) => {
    return new Promise((resolve, reject) => {
      const dbConnection = db.get();
      if (!dbConnection) {
        return reject(new Error("Database not connected"));
      }

      dbConnection
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: new ObjectId(productId) })
        .then((product) => {
          resolve(product);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  updateProduct: (productId, updateData) => {
    return new Promise((resolve, reject) => {
      const dbConnection = db.get();
      if (!dbConnection) {
        return reject(new Error("Database not connected"));
      }

      // Handle 'availableButton' properly
      updateData.availability = updateData.availableButton === "on";
      delete updateData.availableButton; // Remove this field before updating

      dbConnection
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne({ _id: new ObjectId(productId) }, { $set: updateData })
        .then((result) => {
          if (result.modifiedCount === 1) {
            resolve(result);
          } else {
            reject(new Error("No changes made or failed to update product"));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  deleteProduct: (placeId) => {
    return new Promise((resolve, reject) => {
      const dbConnection = db.get();
      if (!dbConnection) {
        return reject(new Error("Database not connected"));
      }

      dbConnection
        .collection(collection.PRODUCT_COLLECTION)
        .deleteOne({ _id: new ObjectId(placeId) })
        .then((response) => {
          if (response.deletedCount === 1) {
            resolve(response);
          } else {
            reject(new Error("Place not found or failed to delete"));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
