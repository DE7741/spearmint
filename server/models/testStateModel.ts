import { Schema as SchemaType } from "mongoose";

// Import mongoose for MongoDB object modeling
const mongoose = require('mongoose');
// Schema constructor
const Schema = mongoose.Schema;

const testStateObj = {
  // Save ID of user that saves test
  userId: { type: String, required: true },
  // Save name of test as user input
  testName: { type: String, required: true },
  // Save corresponding type of test
  testType: { type: String, required: true },
  // Save test state object
  testState: { type: Object, required: true },
};


// Initialize a new schema object for collection 'testState'
const testStateSchema: SchemaType = new Schema(testStateObj);

// Mongoose does not validate the types of the properties specified in schema
// It will only coerce the properties to equal the types specified above
// Therefore we use a pre-script to throw an error if any prop is the incorrect type,
  // preventing the uploading of documents with incorrect data type
testStateSchema.pre('save', function(next) {
  if (typeof testStateObj.userId !== 'string' ||
      typeof testStateObj.testName !== 'string' ||
      typeof testStateObj.testType !== 'string' ||
      typeof testStateObj.testState !== 'object') {
        const err = new Error('type failure');
        return next(err);
      }
  else return next();
});

module.exports = mongoose.model('testState', testStateSchema);
