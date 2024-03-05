const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

//Item model
const Item = require("../../model/Item");

//@route GET api/items
//@decs Get All Items
//@access Public
router.get("/", (req, res) => {
  Item.find()
    .sort({ date: -1 }) //in descending
    .then((items) => res.json(items));
});

//@route POST api/items
//@decs Create An Item
//@access Private
router.post("/", auth, (req, res) => {
  const newItem = new Item({
    name: req.body.name,
  });

  newItem.save().then((item) => res.json(item));
});

//@route DELETE api/items/:id
//@decs Delete An Item
//@access Private
router.delete("/:id", auth, (req, res) => {
  Item.findById(req.params.id).then((item) => {
    if (!item) {
      // Item not found
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    //Item.remove()
    Item.deleteOne({ _id: req.params.id }).then(() =>
      res.json({ success: true })
    );
  });
  //catch(error => res.status(404).json({success: false}))
});

module.exports = router;

//es6 fashion, but we not using babel or anything
//export default router;
