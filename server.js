const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;
const cors = require("cors");

connectDb();
app.use(express.json());

app.use(cors());

app.use("/crm-web/contacts", require("./routes/contactRoutes"));
app.use("/crm-web/users", require("./routes/userRoutes"));
app.use(errorHandler);

// serving the entire folder through the api
app.use('/crm-web/uploads', express.static('uploads'));

app.listen(port, ()=>{
    console.log(`Server Running On ${port}`);
});
