import configDB from "./api/config/db";

db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Define a Mongoose schema and model
  const yourSchema = new mongoose.Schema({ /* Your schema definition here */ });
  const YourModel = mongoose.model('YourModel', yourSchema);

  // Set up a Change Stream on the model
  const changeStream = YourModel.watch();

  // Listen for change events
  changeStream.on('change', (change) => {
    console.log('Change Event:', change);
    // Handle the change event, update your React state, trigger notifications, etc.
  });
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});
