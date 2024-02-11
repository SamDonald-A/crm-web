const asyncHandler = require("express-async-handler");
const Contact = require("../model/contactModel");
//Get (GET) All Contacts
const getContacts = asyncHandler( async (req, res)=>{
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
});

// Create (POST) New or Bulk Contacts
const createContactOrBulk = asyncHandler(async (req, res) => {
    const requestData = req.body;
  
    if (Array.isArray(requestData)) {
      // Bulk create contacts
      const createdContacts = [];
  
      for (const contact of requestData) {
        const { name, phone, place, email } = contact;
  
        if (!name || !phone) {
          res.status(400);
          throw new Error("Name and Phone fields are mandatory for each contact");
        }
  
        const createdContact = await Contact.create({
          name,
          phone,
          place,
          email,
          user_id: req.user.id,
        });
  
        createdContacts.push(createdContact);
      }
  
      res.status(201).json(createdContacts);
    } else {
      // Create a single contact
      const { name, phone, place, email } = requestData;
  
      if (!name || !phone) {
        res.status(400);
        throw new Error("Name & Phone fields are mandatory!");
      }
  
      const contact = await Contact.create({
        name,
        phone,
        place,
        email,
        user_id: req.user.id,
      });
  
      res.status(201).json(contact);
    }
  });


//Get (GET) Individual Contact
const getContact = asyncHandler(async (req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(200).json(contact);
});

//Update (PUT) New Contacts
const updateContact = asyncHandler(async (req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }

    if (contact.user_id.toString() !== req.user.id){
      res.status(403);
      throw new Error("No Permission for others Contact");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedContact);
});



//Delete (DELETE) New Contacts
const deleteContact = asyncHandler(async (req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if (contact.user_id.toString() !== req.user.id){
      res.status(403);
      throw new Error("No Permission for others Contact");
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
});

module.exports = { getContacts, createContactOrBulk, getContact, updateContact, deleteContact };